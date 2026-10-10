import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { defineCommand } from 'citty';
import { buildJsxSnippet, parseManifest } from '@macaw-ds/manifest';
import { readJsonIfExists, writeJson } from '../lib/fsx.ts';
import { loadIndex, loadItem } from '../lib/registry.ts';
import { addCommand, detectPackageManager, run } from '../lib/pm.ts';

export const add = defineCommand({
  meta: {
    name: 'add',
    description: 'Wire a component (package import), or --eject to copy its source into this repo',
  },
  args: {
    name: { type: 'positional', description: 'Component name, e.g. button', required: true },
    eject: {
      type: 'boolean',
      description: 'Copy the source in and record it in .macaw/ejected.json',
      default: false,
    },
    cwd: { type: 'string', default: process.cwd() },
    'skip-install': { type: 'boolean', default: false },
    yes: { type: 'boolean', description: 'Overwrite existing ejected files', default: false },
  },
  async run({ args }) {
    const cwd = args.cwd;
    const index = await loadIndex();
    const item = index.items.find((i) => i.name === args.name && i.type === 'registry:ui');
    if (!item) {
      console.error(
        `not-in-system: "${args.name}". Components: ${index.meta.macaw.components.join(', ')}`,
      );
      process.exitCode = 1;
      return;
    }
    const full = await loadItem(args.name);
    const manifest = parseManifest(full.meta?.macaw?.manifest, `${args.name} manifest`);
    const pm = detectPackageManager(cwd);
    const scope = index.meta.macaw.scope;
    const version = index.meta.macaw.version;

    if (!args.eject) {
      const pkgs = [`${manifest.package}@${version}`];
      if (!args['skip-install']) run(addCommand(pm, pkgs), cwd);
      const example = manifest.examples[0];
      console.log(`\n${manifest.name}: ${manifest.purpose}\n`);
      console.log(
        buildJsxSnippet(manifest, example?.props ?? {}, { importFrom: manifest.package }),
      );
      console.log(`Rules:\n${manifest.rules.map((r) => `  - ${r}`).join('\n')}\n`);
      return;
    }

    // Eject: write the item's files and its registry dependencies (macaw-lib, text, …), then record it.
    const written: string[] = [];
    const queue = [full];
    const seen = new Set<string>();
    while (queue.length) {
      const current = queue.shift()!;
      if (seen.has(current.name)) continue;
      seen.add(current.name);
      for (const dep of current.registryDependencies ?? []) {
        const depName =
          dep
            .split('/')
            .pop()
            ?.replace(/\.json$/, '') ?? '';
        if (depName && depName !== 'tokens' && !seen.has(depName))
          queue.push(await loadItem(depName));
      }
      for (const f of current.files) {
        const target = join(
          cwd,
          f.target.startsWith('components/')
            ? `src/${f.target}`
            : f.target.startsWith('lib/')
              ? `src/${f.target}`
              : f.target,
        );
        const dest = existsSync(join(cwd, 'src')) ? target : join(cwd, f.target);
        if (existsSync(dest) && !args.yes) {
          console.error(`${dest} exists. Re-run with --yes to overwrite.`);
          process.exitCode = 1;
          return;
        }
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, f.content);
        written.push(dest.replace(`${cwd}/`, ''));
      }
    }
    const deps = [
      ...new Set(
        (full.dependencies ?? []).map((d) => (d.startsWith(scope) ? `${d}@${version}` : d)),
      ),
    ];
    if (deps.length && !args['skip-install']) run(addCommand(pm, deps), cwd);

    const recordPath = join(cwd, '.macaw/ejected.json');
    const record = (await readJsonIfExists<{
      ejected: Array<{ name: string; version: string; date: string; files: string[] }>;
    }>(recordPath)) ?? { ejected: [] };
    record.ejected = record.ejected.filter((e) => e.name !== args.name);
    record.ejected.push({
      name: args.name,
      version,
      date: new Date().toISOString().slice(0, 10),
      files: written,
    });
    await writeJson(recordPath, record);

    console.log(
      `Ejected ${manifest.name} (${manifest.package}@${version}):\n${written.map((w) => `  ${w}`).join('\n')}`,
    );
    console.log(
      `\nRecorded in .macaw/ejected.json. This copy is outside the upgrade path; \`macaw diff ${args.name}\` (0.2) will show what it is behind.`,
    );
    console.log(
      `Imports use '@/components/ui/macaw/*' and '@/lib/macaw/*'; make sure the '@/*' alias points at your source root.`,
    );
  },
});
