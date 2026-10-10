/**
 * Copies the generated registry (registry/registry.json, registry/r/*.json) into public/r so
 * `/r/<name>.json` is served as a static file, and the manifest JSON schema into public/schema.
 * Runs before `next build` (see package.json) and is safe to run repeatedly.
 */
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const docsDir = process.cwd();
const repoRoot = path.resolve(docsDir, '..', '..');
const registryDir = path.join(repoRoot, 'registry');
const publicR = path.join(docsDir, 'public', 'r');
const publicSchema = path.join(docsDir, 'public', 'schema');

await rm(publicR, { recursive: true, force: true });
await mkdir(publicR, { recursive: true });
await cp(path.join(registryDir, 'registry.json'), path.join(publicR, 'registry.json'));
const items = (await readdir(path.join(registryDir, 'r'))).filter((f) => f.endsWith('.json'));
for (const file of items) {
  await cp(path.join(registryDir, 'r', file), path.join(publicR, file));
}

await rm(publicSchema, { recursive: true, force: true });
await mkdir(publicSchema, { recursive: true });
await cp(
  path.join(repoRoot, 'packages', 'manifest', 'schema', 'manifest.schema.json'),
  path.join(publicSchema, 'manifest.schema.json'),
);

console.log(
  `copy-registry: registry.json + ${items.length} items → public/r, manifest.schema.json → public/schema`,
);
