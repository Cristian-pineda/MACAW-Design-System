/**
 * Generates plugin/skills/using-macaw/reference/ from registry/ (never from packages/ directly):
 *   components.md      one table an agent can scan before choosing a component
 *   tokens.md          the semantic tokens and the utilities they produce
 *   manifests/*.json   each manifest verbatim
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Manifest } from '@macaw-ds/manifest';
import { ROOT, readJson, type TokenMeta } from '../lib.ts';

const REG = join(ROOT, 'registry');
const OUT = join(ROOT, 'plugin/skills/using-macaw/reference');
await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'manifests'), { recursive: true });

const files = (await readdir(join(REG, 'manifests'))).filter((f) => f.endsWith('.json')).sort();
const manifests: Manifest[] = [];
for (const f of files) {
  const m = await readJson<Manifest>(join(REG, 'manifests', f));
  manifests.push(m);
  await writeFile(join(OUT, 'manifests', f), JSON.stringify(m, null, 2) + '\n');
}
const index = await readJson<{ meta: { macaw: { version: string } } }>(join(REG, 'registry.json'));

const propSummary = (m: Manifest) =>
  Object.entries(m.props)
    .filter(([k, p]) => k !== 'children' && p.type !== 'function')
    .map(([k, p]) => {
      if (p.type !== 'enum') return `${k}: ${p.type}`;
      const vals = p.values ?? [];
      const shown =
        vals.length > 8
          ? `${vals.slice(0, 6).join(' / ')} … (${vals.length} values, see manifest)`
          : vals.join(' / ');
      return `${k}: ${shown}`;
    })
    .join('; ');

const components = `# MACAW components (generated, v${index.meta.macaw.version})

Read the manifest in \`manifests/<slug>.json\` before using a component. Import everything from \`@macaw-ds/ui\` (Icon from \`@macaw-ds/icons\`).

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
${manifests
  .map(
    (m) =>
      `| ${m.name} | \`import { ${m.exports[0]} } from '${m.package}'\` | ${m.purpose} | ${propSummary(m)} | ${m.rules.slice(0, 2).join(' ')} |`,
  )
  .join('\n')}

## Not in the system yet

Anything not listed above. Say \`not-in-system: <what>\` instead of building it: tables, select, dialog, tooltip, popover, tabs, toast, date picker, number or money input, textarea, checkbox, radio, switch, dropdown menu, command palette, app shell.

## Status

${manifests.map((m) => `- ${m.name}: ${m.status} since ${m.since}, budget ${m.budget.gzip} B gzipped`).join('\n')}
`;
await writeFile(join(OUT, 'components.md'), components);

const tokens = await readJson<TokenMeta & { version: string }>(join(REG, 'tokens.json'));
const semantic = tokens.tokens.filter((t) => t.tier === 'semantic');
const groups = new Map<string, typeof semantic>();
for (const t of semantic) {
  const key = t.path.slice(0, 2).join('.');
  groups.set(key, [...(groups.get(key) ?? []), t]);
}
const utilityFor = (t: TokenMeta['tokens'][number]): string => {
  const [root, ...rest] = t.path;
  const key = rest.join('-');
  if (root === 'color') return `bg-${key} · text-${key} · border-${key}`;
  if (root === 'text' && rest[0] === 'size') return `text-${rest[1]}`;
  if (root === 'shape') return `rounded-${key}`;
  if (root === 'elevation') return `shadow-${key}`;
  if (root === 'layout') return `(use the 4px scale: p-4, gap-2)`;
  return '';
};
const tokensMd = `# MACAW tokens (generated, v${tokens.version})

Prefix: \`--${tokens.prefix}-\`. Use the Tailwind utility, never the raw value. Light and dark are modes; never branch on theme.

${[...groups.entries()]
  .map(
    ([g, ts]) => `## ${g}

| Token | Utility | Light | Dark |
|---|---|---|---|
${ts.map((t) => `| ${t.name} | ${utilityFor(t)} | ${String(t.value.light)} | ${t.themed ? String(t.value.dark) : 'same'} |`).join('\n')}`,
  )
  .join('\n\n')}

## Spacing and sizing

4px grid via Tailwind's spacing scale: \`p-1\` = 4px, \`p-4\` = 16px, \`gap-2\` = 8px. Control heights: \`h-control-sm\` 28px, \`h-control-md\` 32px, \`h-control-lg\` 40px. Minimum target 24px.

## Typography utilities

${tokens.tokens
  .filter((t) => t.path[0] === 'text' && t.path[1] === 'size')
  .map((t) => `- \`text-${t.path[2]}\``)
  .join('\n')}

## Motion

\`duration-fast\` 100ms, \`duration-base\` 160ms, \`duration-slow\` 240ms with \`ease-standard\`. Reduced motion collapses all to 0ms automatically.
`;
await writeFile(join(OUT, 'tokens.md'), tokensMd);
console.log(
  `plugin:build: ${manifests.length} manifests, components.md, tokens.md → plugin/skills/using-macaw/reference/`,
);
