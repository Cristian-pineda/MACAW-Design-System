import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
