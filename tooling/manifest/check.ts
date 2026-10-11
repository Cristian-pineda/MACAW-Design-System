/**
 * CI gate: every manifest is schema-valid and consistent with the code and tokens around it.
 * Run after `turbo run build` (needs each package dist and tokens.meta.json).
 */
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { findManifestFiles, LEVEL_RANK, loadAllBlocks, loadTokenMeta, ROOT } from '../lib.ts';
import { loadManifests } from '@macaw-ds/manifest/node';

const problems: string[] = [];
const files = await findManifestFiles();
const loaded = await loadManifests(files).catch((e: Error) => {
  problems.push(e.message);
  return [];
});
const tokenMeta = await loadTokenMeta();
const tokenNames = new Set(tokenMeta.tokens.map((t) => t.name));
const slugs = new Set(loaded.map((l) => l.manifest.slug));

for (const { manifest: m, file } of loaded) {
  const rel = file.replace(`${ROOT}/`, '');
  const folder = basename(dirname(file));
  const expectedFile = `${m.slug}.manifest.json`;
  if (basename(file) !== expectedFile)
    problems.push(`${rel}: file should be named ${expectedFile}`);
  if (folder !== m.slug && folder !== 'src')
    problems.push(`${rel}: folder "${folder}" does not match slug "${m.slug}"`);

  const pkgDir = file.includes('/packages/icons/') ? 'packages/icons' : 'packages/ui';
  const pkgJson = JSON.parse(await readFile(join(ROOT, pkgDir, 'package.json'), 'utf8')) as {
    name: string;
  };
  if (pkgJson.name !== m.package)
    problems.push(`${rel}: package "${m.package}" but lives in ${pkgJson.name}`);

  const dts = await readFile(join(ROOT, pkgDir, 'dist/index.d.ts'), 'utf8').catch(() => '');
  for (const exp of m.exports) {
    const re = new RegExp(`\\b${exp}\\b`);
    if (!re.test(dts))
      problems.push(`${rel}: export "${exp}" not found in ${pkgDir}/dist/index.d.ts`);
  }

  for (const t of m.tokens) if (!tokenNames.has(t)) problems.push(`${rel}: unknown token "${t}"`);

  for (const ex of m.examples) {
    for (const [k, v] of Object.entries(ex.props ?? {})) {
      const spec = m.props[k];
      if (!spec) {
        if (!k.startsWith('aria-') && !['id', 'inputMode', 'defaultValue'].includes(k))
          problems.push(`${rel}: example "${ex.name}" uses unknown prop "${k}"`);
        continue;
      }
      if (spec.type === 'enum' && !spec.values?.includes(String(v)))
        problems.push(
          `${rel}: example "${ex.name}" sets ${k}="${String(v)}" which is not one of ${spec.values?.join(', ')}`,
        );
      if (spec.type === 'boolean' && typeof v !== 'boolean')
        problems.push(`${rel}: example "${ex.name}" sets ${k} to a non-boolean`);
    }
  }

  for (const dep of m.registryDependencies)
    if (!slugs.has(dep))
      problems.push(`${rel}: registryDependencies entry "${dep}" has no manifest`);
  for (const rel2 of m.related)
    if (!slugs.has(rel2)) problems.push(`${rel}: related entry "${rel2}" has no manifest`);
  // ---- Source ⇔ manifest: focus and motion (the playground and CI trust these fields) ----
  const sourceFile = join(dirname(file), `${m.slug}.tsx`);
  const source = await readFile(sourceFile, 'utf8').catch(() => '');
  const usesFocusRing = /\bfocusRing\b/.test(source);
  const focusable = m.a11y.focusable;
  if (usesFocusRing && focusable === false) {
    problems.push(`${rel}: ${m.slug}.tsx applies focusRing but a11y.focusable is false`);
  }
  if (!usesFocusRing && focusable !== false) {
    problems.push(
      `${rel}: a11y.focusable is ${JSON.stringify(focusable)} but ${m.slug}.tsx never applies focusRing, so focus would be invisible`,
    );
  }
  if (focusable === true && m.a11y.keyboard.length === 0) {
    problems.push(`${rel}: focusable components must list their keys in a11y.keyboard`);
  }
  const motionClasses =
    source.match(/\b(?:transition(?:-[a-z]+)?|duration-[a-z]+|animate-[a-z]+|ease-[a-z]+)\b/g) ??
    [];
  if (motionClasses.length && !m.motion) {
    problems.push(
      `${rel}: ${m.slug}.tsx uses motion (${[...new Set(motionClasses)].join(', ')}) but the manifest has no "motion" block`,
    );
  }
  if (!motionClasses.length && m.motion) {
    problems.push(`${rel}: manifest declares motion but ${m.slug}.tsx has no motion utilities`);
  }
  for (const t of m.motion?.tokens ?? []) {
    if (!tokenNames.has(t)) problems.push(`${rel}: motion token "${t}" does not exist`);
  }
  for (const gate of [
    typeof focusable === 'object' ? focusable.whenProp : undefined,
    m.motion?.whenProp,
  ]) {
    if (gate && m.props[gate]?.type !== 'boolean') {
      problems.push(`${rel}: "${gate}" gates focus or motion but is not a boolean prop`);
    }
  }

  if (
    m.a11y.keyboard.length === 0 &&
    ['primitive', 'form', 'navigation', 'overlay'].includes(m.category) &&
    m.slug !== 'icon'
  ) {
    problems.push(`${rel}: interactive category "${m.category}" but a11y.keyboard is empty`);
  }
}

// ---- Atomic hierarchy: a component composes only components at its level or below ----
const levelBySlug = new Map(loaded.map(({ manifest: m }) => [m.slug, m.level]));
const slugByExport = new Map<string, string>();
for (const { manifest: m } of loaded) for (const e of m.exports) slugByExport.set(e, m.slug);
for (const { manifest: m, file } of loaded) {
  const rel = file.replace(`${ROOT}/`, '');
  const source = await readFile(join(dirname(file), `${m.slug}.tsx`), 'utf8').catch(() => '');
  for (const imp of source.matchAll(/from '\.\.\/([a-z-]+)\/[a-z-]+\.tsx'/g)) {
    const dep = imp[1]!;
    const depLevel = levelBySlug.get(dep);
    if (depLevel && LEVEL_RANK[depLevel] > LEVEL_RANK[m.level]) {
      problems.push(
        `${rel}: a ${m.level} cannot compose ${dep} (a ${depLevel}); move it up a level or restructure`,
      );
    }
  }
}

// ---- Blocks: templates and pages ----
const blocks = await loadAllBlocks().catch((e: Error) => {
  problems.push(e.message);
  return [];
});
const blockSlugs = new Map(blocks.map((b) => [b.block.slug, b.block]));
for (const { block: b, file, sourceFile } of blocks) {
  const rel = file.replace(`${ROOT}/`, '');
  if (slugs.has(b.slug)) problems.push(`${rel}: slug "${b.slug}" collides with a component`);
  if (!file.endsWith(`/${b.slug}/${b.slug}.block.json`))
    problems.push(`${rel}: must live at src/${b.slug}/${b.slug}.block.json`);
  const source = await readFile(sourceFile, 'utf8').catch(() => '');
  if (!source) {
    problems.push(`${rel}: missing ${b.slug}.tsx`);
    continue;
  }
  for (const e of b.exports)
    if (!new RegExp(`export (?:function|const) ${e}\\b`).test(source))
      problems.push(`${rel}: export "${e}" not found in ${b.slug}.tsx`);
  for (const u of b.uses) if (!slugs.has(u)) problems.push(`${rel}: uses unknown component "${u}"`);
  // Every MACAW component the source imports must be declared in uses, and vice versa.
  const imported = new Set<string>();
  for (const imp of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*'@macaw-ds\/(?:ui|icons)'/g)) {
    for (const name of imp[1]!
      .split(',')
      .map((n) => n.replace(/\btype\b/, '').trim())
      .filter(Boolean)) {
      const slug = slugByExport.get(name);
      if (slug) imported.add(slug);
    }
  }
  for (const u of imported)
    if (!b.uses.includes(u)) problems.push(`${rel}: imports ${u} but "uses" does not list it`);
  // A page may list what reaches the screen through its template.
  const inherited = new Set(
    b.level === 'page' ? (blockSlugs.get(b.template ?? '')?.uses ?? []) : [],
  );
  for (const u of b.uses) {
    if (!imported.has(u) && !inherited.has(u))
      problems.push(`${rel}: "uses" lists ${u} but neither the source nor its template imports it`);
  }
  if (/from '\.\.\/\.\.\/|from '@macaw-ds\/ui\/src/.test(source))
    problems.push(`${rel}: import components from '@macaw-ds/ui', never from package source`);
  if (b.level === 'page') {
    const t = blockSlugs.get(b.template ?? '');
    if (!t) problems.push(`${rel}: template "${b.template}" does not exist`);
    else if (t.level !== 'template')
      problems.push(`${rel}: "${b.template}" is a ${t.level}, not a template`);
    else if (!source.includes(`'../${t.slug}/${t.slug}.tsx'`))
      problems.push(`${rel}: a page must import its template from '../${t.slug}/${t.slug}.tsx'`);
  }
  if (b.level === 'template' && /from '\.\.\/[a-z-]+\/[a-z-]+\.tsx'/.test(source)) {
    problems.push(`${rel}: a template must not import other blocks`);
  }
}

if (problems.length) {
  console.error(
    `manifest:check found ${problems.length} problem(s):\n` +
      problems.map((p) => `  - ${p}`).join('\n'),
  );
  process.exit(1);
}
console.log(`manifest:check: ${loaded.length} manifests ok (${[...slugs].join(', ')})`);
console.log(
  `manifest:check: ${blocks.length} blocks ok (${blocks.map((b) => `${b.block.slug} [${b.block.level}]`).join(', ') || 'none yet'})`,
);
