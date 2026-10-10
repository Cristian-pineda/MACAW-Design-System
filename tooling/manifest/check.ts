/**
 * CI gate: every manifest is schema-valid and consistent with the code and tokens around it.
 * Run after `turbo run build` (needs each package dist and tokens.meta.json).
 */
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { findManifestFiles, loadTokenMeta, ROOT } from '../lib.ts';
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

if (problems.length) {
  console.error(
    `manifest:check found ${problems.length} problem(s):\n` +
      problems.map((p) => `  - ${p}`).join('\n'),
  );
  process.exit(1);
}
console.log(`manifest:check: ${loaded.length} manifests ok (${[...slugs].join(', ')})`);
