import { existsSync } from 'node:fs';
import { chmod, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineCommand } from 'citty';
import {
  findRootCss,
  hasNextStarterStyles,
  tailwindMajor,
  usesTailwindV3Directives,
  wireCss,
} from '../lib/css.ts';
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
    css: {
      type: 'boolean',
      description: 'Add the MACAW imports to the root CSS file (--no-css to skip)',
      default: true,
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
    const consumer = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    // 0. Tailwind v4 is required; stop before installing anything into a v3 project.
    const rootCss = findRootCss(cwd);
    const cssText = 'path' in rootCss ? await readFile(join(cwd, rootCss.path), 'utf8') : '';
    const twMajor = tailwindMajor(consumer);
    if ((twMajor !== undefined && twMajor < 4) || usesTailwindV3Directives(cssText))
      throw new Error(
        'MACAW needs Tailwind CSS v4; this project uses v3. Upgrade first (https://tailwindcss.com/docs/upgrade-guide), then run init again.',
      );

    // 1. Packages
    const runtime = [
      `${scope}/ui@${version}`,
      `${scope}/tokens@${version}`,
      `${scope}/icons@${version}`,
    ];
    const dev = [`${scope}/eslint-config@${version}`];
    // The verify script and the lint hook call eslint; the config only declares it as a peer.
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
        `import macaw from '${scope}/eslint-config';\n\nexport default [{ ignores: ['.next/**', 'node_modules/**'] }, ...macaw({ tailwindEntry: '${'path' in rootCss ? rootCss.path : 'src/app/globals.css'}' })];\n`,
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

    // 9. Root CSS: the MACAW imports in a marked block after the Tailwind import
    let cssWired = false;
    if (!args.css) log('• --no-css: left your CSS alone');
    else if (twMajor === undefined)
      log(
        '• Tailwind CSS v4 not found in package.json; install it, then run init again to wire the styles',
      );
    else if ('path' in rootCss) {
      const result = await wireCss(join(cwd, rootCss.path), scope);
      cssWired = true;
      log(
        `• ${rootCss.path}: MACAW imports ${result} (between /* macaw:start */ and /* macaw:end */)`,
      );
      if (hasNextStarterStyles(cssText))
        log(
          `  ! ${rootCss.path} still has the create-next-app starter styles (:root colours, @theme fonts, body font). Delete them so the MACAW tokens show through.`,
        );
    } else if (rootCss.reason === 'multiple')
      log(
        `• Found several root CSS files (${rootCss.found.join(', ')}); add the imports to the one your app loads`,
      );
    else
      log(
        '• No root CSS file found in the usual places; add the imports to the one your app loads',
      );

    const steps = [
      ...(cssWired
        ? []
        : [
            `Import the styles once in your root CSS:
       @import "tailwindcss";
       @import "${scope}/tokens/tokens.css";
       @import "${scope}/tokens/theme.css";
       @import "${scope}/ui/styles.css";`,
          ]),
      'Optional: set <html data-theme="light"> or "dark" (omit it to follow the OS). Load Inter and Geist Mono for the intended type (next/font/google).',
      'Start a new Claude session: the using-macaw skill, the reviewer agent and the macaw MCP server are ready.',
      `${runScript(pm, 'verify')} runs lint and types; the Stop hook runs it before Claude reports done.`,
    ];
    log(`\nDone. Next:\n${steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}\n`);
  },
});
