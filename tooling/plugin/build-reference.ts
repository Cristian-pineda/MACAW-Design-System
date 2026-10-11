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

const LEVEL_TITLE = {
  atom: 'Atoms',
  molecule: 'Molecules',
  organism: 'Organisms',
  template: 'Templates',
} as const;

const components = `# MACAW components (generated, v${index.meta.macaw.version})

Read the manifest in \`manifests/<slug>.json\` before using a component. Import everything from \`@macaw-ds/ui\` (Icon from \`@macaw-ds/icons\`).

Components are grouped by atomic level. A level composes only levels below it: atoms, then molecules, organisms and templates. Templates and pages that are whole screens live in \`blocks.md\`.

${(['atom', 'molecule', 'organism', 'template'] as const)
  .map((level) => {
    const rows = manifests.filter((m) => m.level === level);
    if (!rows.length) return '';
    return `## ${LEVEL_TITLE[level]}

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
${rows
  .map(
    (m) =>
      `| ${m.name} | \`import { ${m.exports[0]} } from '${m.package}'\` | ${m.purpose} | ${propSummary(m)} | ${m.rules.slice(0, 2).join(' ')} |`,
  )
  .join('\n')}
`;
  })
  .filter(Boolean)
  .join('\n')}
## Not in the system yet

Anything not listed above. Say \`not-in-system: <what>\` instead of building it: tables, select, dialog, tooltip, popover, in-page tabs, toast, date picker, number or money input, textarea, checkbox, radio, switch, dropdown menu, command palette.

## Status

${manifests.map((m) => `- ${m.name}: ${m.status} since ${m.since}, budget ${m.budget.gzip} B gzipped`).join('\n')}
`;
await writeFile(join(OUT, 'components.md'), components);

// ---- blocks.md + consumer-shaped block sources ----
interface BlockItem {
  name: string;
  title: string;
  files: Array<{ content: string; target: string }>;
  meta: {
    macaw: {
      level: 'template' | 'page';
      uses: string[];
      template?: string;
      block: {
        purpose: string;
        whenToUse: string[];
        whenNotToUse: string[];
        rules: string[];
        exports: string[];
      };
    };
  };
}
const blockSlugs = (index.meta.macaw as { blocks?: string[] }).blocks ?? [];
const blockItems: BlockItem[] = [];
await mkdir(join(OUT, 'blocks'), { recursive: true });
for (const slug of blockSlugs) {
  const item = await readJson<BlockItem>(join(REG, 'r', `${slug}.json`));
  blockItems.push(item);
  await writeFile(join(OUT, 'blocks', `${slug}.tsx`), item.files[0]!.content);
}
const blockSection = (level: 'template' | 'page') =>
  blockItems
    .filter((b) => b.meta.macaw.level === level)
    .map((b) => {
      const m = b.meta.macaw;
      return `### ${b.title} (\`${b.name}\`)

${m.block.purpose}

- Install: \`npx @macaw-ds/cli add ${b.name}\` (writes \`${b.files[0]!.target}\`${m.template ? ` and its template \`${m.template}\`` : ''})
- Source: \`blocks/${b.name}.tsx\` · exports ${m.block.exports.map((e) => `\`${e}\``).join(', ')}
- Uses: ${m.uses.join(', ')}${m.template ? `\n- Fills template: ${m.template}` : ''}
- Use for: ${m.block.whenToUse.join(' ')}${m.block.whenNotToUse.length ? `\n- Not for: ${m.block.whenNotToUse.join(' ')}` : ''}${m.block.rules.length ? `\n- Rules: ${m.block.rules.join(' ')}` : ''}
`;
    })
    .join('\n');
await writeFile(
  join(OUT, 'blocks.md'),
  `# MACAW templates and pages (generated, v${index.meta.macaw.version})

Templates are page structure with placeholder content; pages are templates filled with realistic content. Both are compositions you copy in and own; the components inside still come from \`@macaw-ds/ui\`. Start a new screen from the closest template instead of composing from scratch, and read the page examples to see how a template is filled.

## Templates

${blockSection('template') || 'None yet.'}

## Pages

${blockSection('page') || 'None yet.'}
`,
);

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
  `plugin:build: ${manifests.length} manifests, ${blockSlugs.length} blocks, components.md, blocks.md, tokens.md → plugin/skills/using-macaw/reference/`,
);
