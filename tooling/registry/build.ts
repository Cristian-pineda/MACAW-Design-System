/**
 * Generates registry/ from packages/ui, packages/icons and packages/tokens (booklet §8):
 *   registry.json           index (shadcn registry.json shape + meta.macaw)
 *   r/<slug>.json           shadcn registry-item with eject sources and the embedded manifest
 *   r/macaw-lib.json        shared helpers the ejected sources import
 *   r/tokens.json           registry:style carrying the CSS variables for shadcn consumers
 *   manifests/<slug>.json   each manifest verbatim
 *   tokens.json             token metadata with light and dark values
 * Both doors (CLI and MCP) and the docs read these files; nothing reads packages/ directly.
 */
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadAllBlocks, loadAllManifests, loadTokenMeta, packageVersion, readJson, ROOT, SCOPE } from '../lib.ts';

// Build into a temporary sibling and swap it in at the end, so readers (the docs dev server, a
// concurrent typecheck, the CLI) never see a half-written registry.
const FINAL = join(ROOT, 'registry');
const OUT = join(ROOT, `.registry-build-${process.pid}`);
const BASE_URL = (process.env.REGISTRY_BASE_URL ?? 'https://macaw-design-system.vercel.app').replace(/\/$/, '');
const version = await packageVersion('packages/ui');
const manifests = await loadAllManifests();
const tokenMeta = await loadTokenMeta();

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, 'r'), { recursive: true });
process.on('exit', () => {
  // Best effort: never leave a temporary build directory behind on failure.
  void rm(OUT, { recursive: true, force: true });
});
await mkdir(join(OUT, 'manifests'), { recursive: true });

/** Rewrites workspace-relative imports in a component source into consumer-shaped ones. */
function rewriteImports(source: string): string {
  return source
    .replace(/from '\.\.\/lib\/(\w+)\.ts'/g, "from '@/lib/macaw/$1'")
    .replace(/from '\.\/(\w+)\.tsx?'/g, "from './$1'")
    .replace(/from '\.\.\/(\w+)\/(\w+)\.tsx?'/g, "from '@/components/ui/macaw/$2'")
    .replace(/from '\.\/generated\/names\.ts'/g, "from './names'");
}

const libFiles = ['cn.ts', 'focus.ts', 'types.ts'];
const libItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'macaw-lib',
  type: 'registry:lib',
  title: 'MACAW helpers',
  description: 'cn, focusRing and NativeProps used by every ejected MACAW component.',
  dependencies: ['class-variance-authority'],
  files: await Promise.all(
    libFiles.map(async (f) => ({
      path: `registry/macaw/lib/${f}`,
      type: 'registry:lib',
      target: `lib/macaw/${f}`,
      content: rewriteImports(await readFile(join(ROOT, 'packages/ui/src/lib', f), 'utf8')),
    })),
  ),
  meta: { macaw: { version } },
};
await writeFile(join(OUT, 'r/macaw-lib.json'), JSON.stringify(libItem, null, 2) + '\n');

const items: unknown[] = [];
for (const { manifest: m, file } of manifests) {
  const isIcon = m.package === `${SCOPE}/icons`;
  const srcDir = isIcon ? join(ROOT, 'packages/icons/src') : join(ROOT, 'packages/ui/src', m.slug);
  const mainFile = `${m.slug}.tsx`;
  const files: Array<{ path: string; type: string; target: string; content: string }> = [
    {
      path: `registry/macaw/ui/${mainFile}`,
      type: 'registry:ui',
      target: `components/ui/macaw/${mainFile}`,
      content: rewriteImports(await readFile(join(srcDir, mainFile), 'utf8')),
    },
  ];
  if (isIcon) {
    files.push({
      path: 'registry/macaw/ui/names.ts',
      type: 'registry:ui',
      target: 'components/ui/macaw/names.ts',
      content: await readFile(join(srcDir, 'generated/names.ts'), 'utf8'),
    });
  }
  const registryDependencies = [
    `${BASE_URL}/r/macaw-lib.json`,
    `${BASE_URL}/r/tokens.json`,
    ...m.registryDependencies.map((d) => `${BASE_URL}/r/${d}.json`),
  ];
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: m.slug,
    type: 'registry:ui',
    title: m.name,
    description: m.purpose,
    dependencies: m.dependencies.filter((d) => !d.startsWith(SCOPE)).concat(isIcon ? [] : [`${SCOPE}/icons`].filter((d) => m.dependencies.includes(d))),
    registryDependencies,
    files,
    docs: `Ejected from ${m.package}@${version}. ${m.rules.slice(0, 2).join(' ')}`,
    categories: [m.category],
    meta: { macaw: { version, kind: 'component', level: m.level, package: m.package, status: m.status, slug: m.slug, manifest: m } },
  };
  await writeFile(join(OUT, 'r', `${m.slug}.json`), JSON.stringify(item, null, 2) + '\n');
  await writeFile(join(OUT, 'manifests', `${m.slug}.json`), JSON.stringify({ ...m, $schema: undefined }, null, 2) + '\n');
  items.push({
    name: m.slug,
    type: 'registry:ui',
    title: m.name,
    description: m.purpose,
    files: files.map(({ path, type, target }) => ({ path, type, target })),
    meta: { macaw: { version, kind: 'component', level: m.level, package: m.package, status: m.status, category: m.category, since: m.since, exports: m.exports, budget: m.budget, file: file.replace(`${ROOT}/`, '') } },
  });
}

// Tokens as a shadcn style item, so `npx shadcn add <url>/r/button.json` pulls the theme too.
const theme = await readFile(join(ROOT, 'packages/tokens/dist/theme.css'), 'utf8');
const tokensCss = await readFile(join(ROOT, 'packages/tokens/dist/tokens.css'), 'utf8');
const cssVars = { light: {} as Record<string, string>, dark: {} as Record<string, string> };
for (const t of tokenMeta.tokens) {
  const key = t.cssVar.replace(/^--/, '');
  cssVars.light[key] = String(t.value.light);
  if (t.themed) cssVars.dark[key] = String(t.value.dark);
}
const themeVars: Record<string, string> = {};
for (const m of theme.matchAll(/^\s+(--[a-z0-9-]+(?:--[a-z-]+)?):\s*([^;]+);/gm)) {
  if (m[1] && m[2] && !m[1].endsWith('-*')) themeVars[m[1].replace(/^--/, '')] = m[2];
}
const tokensItem = {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: 'tokens',
  type: 'registry:style',
  title: 'MACAW tokens',
  description: 'CSS variables and the Tailwind theme for MACAW components.',
  dependencies: [`${SCOPE}/tokens`],
  cssVars: { theme: themeVars, light: cssVars.light, dark: cssVars.dark },
  css: {
    '@import "@macaw-ds/tokens/tokens.css"': {},
    '@import "@macaw-ds/tokens/theme.css"': {},
  },
  docs: 'Adds the MACAW token stylesheets. Prefer importing @macaw-ds/tokens/tokens.css and theme.css in your root CSS.',
  meta: { macaw: { version, tokensCssBytes: tokensCss.length } },
};
await writeFile(join(OUT, 'r/tokens.json'), JSON.stringify(tokensItem, null, 2) + '\n');
await writeFile(join(OUT, 'tokens.json'), JSON.stringify({ version, ...tokenMeta }, null, 2) + '\n');

// ---- Blocks: templates and pages, copied into the consumer as a starting point ----
await mkdir(join(OUT, 'blocks'), { recursive: true });
const blocks = await loadAllBlocks();
const blockItems: unknown[] = [];
const blockTarget = (slug: string) => `components/macaw/blocks/${slug}.tsx`;
for (const { block: b, file, sourceFile } of blocks) {
  const content = (await readFile(sourceFile, 'utf8')).replace(
    /from '\.\.\/([a-z-]+)\/[a-z-]+\.tsx'/g,
    (_m, slug: string) => `from '@/components/macaw/blocks/${slug}'`,
  );
  const item = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: b.slug,
    type: 'registry:block',
    title: b.name,
    description: b.purpose,
    dependencies: [...new Set([`${SCOPE}/ui`, `${SCOPE}/icons`, `${SCOPE}/tokens`, ...b.dependencies])],
    registryDependencies: [`${BASE_URL}/r/tokens.json`, ...(b.template ? [`${BASE_URL}/r/${b.template}.json`] : [])],
    files: [{ path: `registry/macaw/blocks/${b.slug}.tsx`, type: 'registry:block', target: blockTarget(b.slug), content }],
    docs: `A ${b.level} from MACAW ${version}. Components come from ${SCOPE}/ui and stay on the upgrade path; this composition is yours to edit.`,
    categories: [b.level],
    meta: { macaw: { version, kind: 'block', level: b.level, slug: b.slug, uses: b.uses, template: b.template, block: b } },
  };
  await writeFile(join(OUT, 'r', `${b.slug}.json`), JSON.stringify(item, null, 2) + '\n');
  await writeFile(join(OUT, 'blocks', `${b.slug}.json`), JSON.stringify({ ...b, $schema: undefined }, null, 2) + '\n');
  blockItems.push({
    name: b.slug,
    type: 'registry:block',
    title: b.name,
    description: b.purpose,
    files: [{ path: `registry/macaw/blocks/${b.slug}.tsx`, type: 'registry:block', target: blockTarget(b.slug) }],
    meta: { macaw: { version, kind: 'block', level: b.level, status: b.status, since: b.since, exports: b.exports, uses: b.uses, template: b.template, file: file.replace(`${ROOT}/`, '') } },
  });
}

const index = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'macaw',
  homepage: BASE_URL,
  items: [
    ...items,
    ...blockItems,
    { name: 'macaw-lib', type: 'registry:lib', title: libItem.title, description: libItem.description, files: libItem.files.map(({ path, type, target }) => ({ path, type, target })) },
    { name: 'tokens', type: 'registry:style', title: tokensItem.title, description: tokensItem.description },
  ],
  meta: { macaw: { version, scope: SCOPE, generatedFrom: 'packages/ui, packages/icons, packages/tokens', components: manifests.map((m) => m.manifest.slug), blocks: blocks.map((b) => b.block.slug), levels: ['atom', 'molecule', 'organism', 'template', 'page'] } },
};
await writeFile(join(OUT, 'registry.json'), JSON.stringify(index, null, 2) + '\n');

// Validate against shadcn's published schemas when vendored (tooling/registry/schemas/*.json).
try {
  const { default: Ajv } = await import('ajv');
  const ajv = new Ajv({ strict: false, allErrors: true });
  const itemSchema = await readJson<Record<string, unknown>>(join(ROOT, 'tooling/registry/schemas/registry-item.json'));
  delete itemSchema.$schema; // shadcn declares the https draft-07 id, which Ajv registers under http
  const validateItem = ajv.compile(itemSchema);
  for (const slug of [...manifests.map((m) => m.manifest.slug), ...blocks.map((b) => b.block.slug)]) {
    const item = await readJson(join(OUT, 'r', `${slug}.json`));
    if (!validateItem(item)) throw new Error(`r/${slug}.json: ${ajv.errorsText(validateItem.errors)}`);
  }
  console.log('registry:build: validated against shadcn registry-item schema');
} catch (e) {
  if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
}

const previous = `${FINAL}.previous-${process.pid}`;
await rm(previous, { recursive: true, force: true });
await rename(FINAL, previous).catch(() => undefined);
await rename(OUT, FINAL);
await rm(previous, { recursive: true, force: true });

console.log(`registry:build: ${items.length} components, ${blockItems.length} blocks, macaw-lib, tokens → registry/ (base ${BASE_URL})`);
