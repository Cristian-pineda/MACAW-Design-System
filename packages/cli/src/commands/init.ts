import { existsSync } from 'node:fs';
import { chmod, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineCommand } from 'citty';
import { copyDir, readJsonIfExists, upsertBlock, writeJson } from '../lib/fsx.ts';
import { pluginDir } from '../lib/paths.ts';
import { loadIndex } from '../lib/registry.ts';
import { addCommand, detectPackageManager, run, runScript } from '../lib/pm.ts';

interface Settings {
  hooks?: Record<
    string,
    Array<{
      matcher?: string;
      hooks: Array<{ type: string; command: string; timeout?: number }>;
      macaw?: boolean;
    }>
  >;
  [k: string]: unknown;
}

export const init = defineCommand({
  meta: {
    name: 'init',
    description: 'Install MACAW packages and the Claude plugin into this repo',
  },
  args: {
    cwd: { type: 'string', description: 'Project directory', default: process.cwd() },
    'skip-install': {
      type: 'boolean',
      description: 'Do not run the package manager',
      default: false,
    },
    quiet: { type: 'boolean', default: false },
  },
  async run({ args }) {
    const cwd = args.cwd;
    const log = (s: string) => !args.quiet && console.log(s);
    const index = await loadIndex();
    const version = index.meta.macaw.version;
    const scope = index.meta.macaw.scope;
    const pm = detectPackageManager(cwd);

    if (!existsSync(join(cwd, 'package.json')))
      throw new Error(`No package.json in ${cwd}. Run init inside your app.`);

    // 1. Packages
    const runtime = [
      `${scope}/ui@${version}`,
      `${scope}/tokens@${version}`,
      `${scope}/icons@${version}`,
    ];
    const dev = [`${scope}/eslint-config@${version}`];
    // The verify script and the lint hook call eslint; the config only declares it as a peer.
    const consumer = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    if (!consumer.dependencies?.eslint && !consumer.devDependencies?.eslint) dev.push('eslint@^10');
    if (args['skip-install'])
      log(
        `• skip-install: would run ${addCommand(pm, runtime).join(' ')} and ${addCommand(pm, dev, true).join(' ')}`,
      );
    else {
      log(`• Installing ${runtime.join(' ')} with ${pm}`);
      run(addCommand(pm, runtime), cwd);
      run(addCommand(pm, dev, true), cwd);
    }

    // 2. Plugin → .claude/
    const plugin = pluginDir();
    await copyDir(join(plugin, 'skills'), join(cwd, '.claude/skills'));
    await copyDir(join(plugin, 'agents'), join(cwd, '.claude/agents'));
    await copyDir(join(plugin, 'hooks/scripts'), join(cwd, '.claude/hooks/macaw'));
    for (const f of await readdir(join(cwd, '.claude/hooks/macaw')))
      if (f.endsWith('.sh')) await chmod(join(cwd, '.claude/hooks/macaw', f), 0o755);
    log('• Copied skills/using-macaw, agents/macaw-reviewer and hooks into .claude/');

    // 3. Hooks → .claude/settings.json (idempotent, marked)
    const settingsPath = join(cwd, '.claude/settings.json');
    const settings = (await readJsonIfExists<Settings>(settingsPath)) ?? {};
    const pluginHooks = JSON.parse(await readFile(join(plugin, 'hooks/hooks.json'), 'utf8')) as {
      hooks: NonNullable<Settings['hooks']>;
    };
    settings.hooks ??= {};
    for (const [event, groups] of Object.entries(pluginHooks.hooks)) {
      const kept = (settings.hooks[event] ?? []).filter((g) => !g.macaw);
      const ours = groups.map((g) => ({
        ...g,
        macaw: true,
        hooks: g.hooks.map((h) => ({
          ...h,
          command: h.command.replace(
            '"${CLAUDE_PLUGIN_ROOT}"/hooks/scripts/',
            '"$CLAUDE_PROJECT_DIR"/.claude/hooks/macaw/',
          ),
        })),
      }));
      settings.hooks[event] = [...kept, ...ours];
    }
    await writeJson(settingsPath, settings);
    log('• Wired hooks in .claude/settings.json (guard, lint after edit, verify on stop)');

    // 4. CLAUDE.md block
    const template = await readFile(join(plugin, 'templates/CLAUDE.md'), 'utf8');
    const result = await upsertBlock(
      join(cwd, 'CLAUDE.md'),
      template,
      '<!-- macaw:start -->',
      '<!-- macaw:end -->',
    );
    log(`• CLAUDE.md ${result}`);

    // 5. MCP server
    const mcpPath = join(cwd, '.mcp.json');
    const mcp = (await readJsonIfExists<{ mcpServers?: Record<string, unknown> }>(mcpPath)) ?? {};
    mcp.mcpServers = {
      ...(mcp.mcpServers ?? {}),
      macaw: { command: 'npx', args: ['-y', `${scope}/mcp@${version}`] },
    };
    await writeJson(mcpPath, mcp);
    log('• Added the macaw MCP server to .mcp.json');

    // 6. verify script
    const pkgPath = join(cwd, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as { scripts?: Record<string, string> };
    pkg.scripts ??= {};
    if (!pkg.scripts.verify) {
      pkg.scripts.verify = 'eslint . && tsc --noEmit';
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      log('• Added "verify" script (eslint . && tsc --noEmit)');
    }

    // 7. ESLint config if none
    const hasEslint = ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.ts'].some((f) =>
      existsSync(join(cwd, f)),
    );
    if (!hasEslint) {
      await writeFile(
        join(cwd, 'eslint.config.mjs'),
        `import macaw from '${scope}/eslint-config';\n\nexport default [{ ignores: ['.next/**', 'node_modules/**'] }, ...macaw({ tailwindEntry: 'src/app/globals.css' })];\n`,
      );
      log(
        '• Created eslint.config.mjs with the MACAW rules (adjust tailwindEntry if your CSS lives elsewhere)',
      );
    } else
      log(
        '• eslint config exists; add `...macaw({ tailwindEntry })` from @macaw-ds/eslint-config to it',
      );

    // 8. shadcn registry namespace, if the project uses shadcn
    const componentsJson = join(cwd, 'components.json');
    const cj = await readJsonIfExists<{ registries?: Record<string, string> }>(componentsJson);
    if (cj) {
      cj.registries = { ...(cj.registries ?? {}), '@macaw': `${index.homepage}/r/{name}.json` };
      await writeJson(componentsJson, cj);
      log('• Registered @macaw in components.json for `npx shadcn add @macaw/button`');
    }

    log(`
Done. Next:
  1. Import the styles once in your root CSS:
       @import "tailwindcss";
       @import "${scope}/tokens/tokens.css";
       @import "${scope}/tokens/theme.css";
       @import "${scope}/ui/styles.css";
  2. Set <html data-theme="light"> (or "dark", or omit to follow the OS). Load Inter and Geist Mono if you want the intended type (next/font/google).
  3. Start a new Claude session: the using-macaw skill, the reviewer agent and the macaw MCP server are ready.
  4. ${runScript(pm, 'verify')} runs lint and types; the Stop hook runs it before Claude reports done.
`);
  },
});
