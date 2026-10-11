import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const pkgRoot = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = join(pkgRoot, '..', '..');
const bin = join(pkgRoot, 'dist/index.js');

function macaw(args: string[], cwd: string): string {
  return execFileSync('node', [bin, ...args, '--cwd', cwd], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, MACAW_TEMPLATES_DIR: join(pkgRoot, 'templates') },
  });
}

describe('macaw cli', () => {
  let dir: string;
  beforeAll(() => {
    if (!existsSync(bin)) throw new Error('build the CLI first (pnpm build)');
    dir = mkdtempSync(join(tmpdir(), 'macaw-cli-'));
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: 'consumer', private: true, scripts: {} }),
    );
    writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
  });
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('init installs the plugin into .claude/, CLAUDE.md, .mcp.json and the verify script', () => {
    const out = macaw(['init', '--skip-install'], dir);
    expect(out).toContain('Done');
    expect(out).toMatch(/would run .*eslint-config@\S+ eslint@\^10/);
    expect(existsSync(join(dir, '.claude/skills/using-macaw/SKILL.md'))).toBe(true);
    expect(existsSync(join(dir, '.claude/skills/using-macaw/reference/components.md'))).toBe(true);
    expect(existsSync(join(dir, '.claude/agents/macaw-reviewer.md'))).toBe(true);
    expect(existsSync(join(dir, '.claude/hooks/macaw/verify-on-stop.sh'))).toBe(true);
    const settings = JSON.parse(readFileSync(join(dir, '.claude/settings.json'), 'utf8'));
    expect(settings.hooks.Stop[0].macaw).toBe(true);
    expect(settings.hooks.PostToolUse[0].hooks[0].command).toContain(
      '.claude/hooks/macaw/lint-file.sh',
    );
    expect(readFileSync(join(dir, 'CLAUDE.md'), 'utf8')).toMatch(
      /macaw:start[\s\S]*not-in-system[\s\S]*macaw:end/,
    );
    const mcp = JSON.parse(readFileSync(join(dir, '.mcp.json'), 'utf8'));
    expect(mcp.mcpServers.macaw.args[1]).toMatch(/^@macaw-ds\/mcp@/);
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    expect(pkg.scripts.verify).toContain('eslint');
    expect(existsSync(join(dir, 'eslint.config.mjs'))).toBe(true);
  });

  it('init is idempotent', () => {
    macaw(['init', '--skip-install'], dir);
    const settings = JSON.parse(readFileSync(join(dir, '.claude/settings.json'), 'utf8'));
    expect(settings.hooks.Stop).toHaveLength(1);
    expect(readFileSync(join(dir, 'CLAUDE.md'), 'utf8').match(/macaw:start/g)).toHaveLength(1);
  });

  it('add prints a snippet for a known component and not-in-system for an unknown one', () => {
    const out = macaw(['add', 'button', '--skip-install'], dir);
    expect(out).toContain("import { Button } from '@macaw-ds/ui'");
    expect(out).toContain('One primary button per view');
    expect(() => macaw(['add', 'data-table', '--skip-install'], dir)).toThrow(/not-in-system/);
  });

  it('add --eject writes the source, its lib dependencies and the eject record', () => {
    const out = macaw(['add', 'button', '--eject', '--skip-install'], dir);
    expect(out).toContain('Ejected Button');
    expect(existsSync(join(dir, 'components/ui/macaw/button.tsx'))).toBe(true);
    expect(existsSync(join(dir, 'lib/macaw/cn.ts'))).toBe(true);
    const src = readFileSync(join(dir, 'components/ui/macaw/button.tsx'), 'utf8');
    expect(src).toContain("from '@/lib/macaw/cn'");
    expect(src).not.toContain('../lib/');
    const record = JSON.parse(readFileSync(join(dir, '.macaw/ejected.json'), 'utf8'));
    expect(record.ejected[0].name).toBe('button');
    expect(record.ejected[0].version).toBe(
      JSON.parse(readFileSync(join(repoRoot, 'packages/ui/package.json'), 'utf8')).version,
    );
  });

  const index = JSON.parse(readFileSync(join(repoRoot, 'registry/registry.json'), 'utf8'));
  const page = index.items.find(
    (i: { type: string; meta?: { macaw?: { level?: string } } }) =>
      i.type === 'registry:block' && i.meta?.macaw?.level === 'page',
  );

  it.skipIf(!page)(
    'add <page> copies the page and the template it fills, and records nothing as ejected',
    () => {
      const before = readFileSync(join(dir, '.macaw/ejected.json'), 'utf8');
      const out = macaw(['add', page.name, '--skip-install'], dir);
      expect(out).toContain(`Added ${page.name}`);
      const pagePath = join(dir, `components/macaw/blocks/${page.name}.tsx`);
      const templatePath = join(dir, `components/macaw/blocks/${page.meta.macaw.template}.tsx`);
      expect(existsSync(pagePath)).toBe(true);
      expect(existsSync(templatePath)).toBe(true);
      const src = readFileSync(pagePath, 'utf8');
      expect(src).toContain(`from '@/components/macaw/blocks/${page.meta.macaw.template}'`);
      // Components come from the package, through the template at least.
      expect(readFileSync(templatePath, 'utf8')).toContain("from '@macaw-ds/ui'");
      expect(src).not.toMatch(/from '\.\.\//);
      expect(readFileSync(join(dir, '.macaw/ejected.json'), 'utf8')).toBe(before);
    },
  );
});

describe('macaw init: root CSS', () => {
  // create-next-app's starter globals.css
  const nextStarter = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
`;
  const dirs: string[] = [];
  function app(tailwind: string | null, files: Record<string, string>): string {
    const dir = mkdtempSync(join(tmpdir(), 'macaw-css-'));
    dirs.push(dir);
    const devDependencies = tailwind ? { tailwindcss: tailwind } : {};
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name: 'consumer', private: true, scripts: {}, devDependencies }),
    );
    writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(dir, path, '..'), { recursive: true });
      writeFileSync(join(dir, path), content);
    }
    return dir;
  }
  afterAll(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

  it('adds the imports after the Tailwind import, once, and flags the Next starter styles', () => {
    const dir = app('^4.1.0', { 'src/app/globals.css': nextStarter });
    const out = macaw(['init', '--skip-install'], dir);
    const css = readFileSync(join(dir, 'src/app/globals.css'), 'utf8');
    expect(
      css.startsWith(
        '@import "tailwindcss";\n/* macaw:start */\n@import "@macaw-ds/tokens/tokens.css";',
      ),
    ).toBe(true);
    expect(css.match(/@import "tailwindcss"/g)).toHaveLength(1);
    expect(css).toContain('@import "@macaw-ds/ui/styles.css";\n/* macaw:end */');
    expect(css).toContain('font-family: Arial');
    expect(out).toContain('create-next-app starter styles');
    expect(out).not.toContain('Import the styles once');
    expect(readFileSync(join(dir, 'eslint.config.mjs'), 'utf8')).toContain(
      "tailwindEntry: 'src/app/globals.css'",
    );

    macaw(['init', '--skip-install'], dir);
    expect(readFileSync(join(dir, 'src/app/globals.css'), 'utf8')).toBe(css);
  });

  it('keeps options on an existing Tailwind import', () => {
    const dir = app('^4.1.0', {
      'src/index.css': '@import "tailwindcss" source("../src");\n\nh1 { margin: 0; }\n',
    });
    macaw(['init', '--skip-install'], dir);
    const css = readFileSync(join(dir, 'src/index.css'), 'utf8');
    expect(css).toMatch(/^@import "tailwindcss" source\("\.\.\/src"\);\n\/\* macaw:start \*\//);
    expect(css).toContain('h1 { margin: 0; }');
  });

  it('puts the Tailwind import in the block when the file has none', () => {
    const dir = app('^4.1.0', { 'app/app.css': 'h1 { margin: 0; }\n' });
    macaw(['init', '--skip-install'], dir);
    const css = readFileSync(join(dir, 'app/app.css'), 'utf8');
    expect(css).toMatch(/^\/\* macaw:start \*\/\n@import "tailwindcss";\n/);
    expect(css).toMatch(/macaw:end \*\/\n\nh1 \{ margin: 0; \}\n$/);
  });

  it('refuses a Tailwind v3 project before changing anything', () => {
    const dir = app('^3.4.17', { 'src/index.css': '@tailwind base;\n@tailwind utilities;\n' });
    expect(() => macaw(['init', '--skip-install'], dir)).toThrow(/Tailwind CSS v4/);
    expect(existsSync(join(dir, '.claude'))).toBe(false);
    expect(readFileSync(join(dir, 'src/index.css'), 'utf8')).toBe(
      '@tailwind base;\n@tailwind utilities;\n',
    );
  });

  it('leaves CSS alone with --no-css, with several candidates, or without Tailwind', () => {
    const noCss = app('^4.1.0', { 'src/index.css': nextStarter });
    expect(macaw(['init', '--skip-install', '--no-css'], noCss)).toContain(
      'Import the styles once',
    );
    expect(readFileSync(join(noCss, 'src/index.css'), 'utf8')).toBe(nextStarter);

    const several = app('^4.1.0', { 'src/index.css': nextStarter, 'app/globals.css': nextStarter });
    expect(macaw(['init', '--skip-install'], several)).toContain('Found several root CSS files');
    expect(readFileSync(join(several, 'src/index.css'), 'utf8')).toBe(nextStarter);

    const noTailwind = app(null, { 'src/index.css': 'h1 {}\n' });
    expect(macaw(['init', '--skip-install'], noTailwind)).toContain('Tailwind CSS v4 not found');
    expect(readFileSync(join(noTailwind, 'src/index.css'), 'utf8')).toBe('h1 {}\n');
  });
});
