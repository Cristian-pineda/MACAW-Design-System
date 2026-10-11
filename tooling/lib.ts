import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseBlock, type Block } from '@macaw-ds/manifest';
import { loadManifests, type LoadedManifest } from '@macaw-ds/manifest/node';

export const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
export const SCOPE = '@macaw-ds';

export async function walk(dir: string, out: string[] = []): Promise<string[]> {
  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    const s = await stat(p);
    if (s.isDirectory()) {
      if (e === 'node_modules' || e === 'dist') continue;
      await walk(p, out);
    } else out.push(p);
  }
  return out;
}

export async function findManifestFiles(): Promise<string[]> {
  const files = [
    ...(await walk(join(ROOT, 'packages/ui/src'))),
    ...(await walk(join(ROOT, 'packages/icons/src'))),
  ];
  return files.filter((f) => f.endsWith('.manifest.json')).sort();
}

export async function loadAllManifests(): Promise<LoadedManifest[]> {
  return loadManifests(await findManifestFiles());
}

export async function readJson<T = unknown>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T;
}

export async function packageVersion(pkgDir: string): Promise<string> {
  const pkg = await readJson<{ version: string }>(join(ROOT, pkgDir, 'package.json'));
  return pkg.version;
}

export interface TokenMeta {
  prefix: string;
  tokens: Array<{
    name: string;
    cssVar: string;
    path: string[];
    type: string;
    tier: 'primitive' | 'semantic' | 'component';
    description?: string;
    original: unknown;
    value: { light: unknown; dark: unknown };
    themed: boolean;
    file: string;
  }>;
}

export async function loadTokenMeta(): Promise<TokenMeta> {
  return readJson<TokenMeta>(join(ROOT, 'packages/tokens/dist/tokens.meta.json'));
}

export const LEVEL_RANK = { atom: 1, molecule: 2, organism: 3, template: 4, page: 5 } as const;

export interface LoadedBlock {
  block: Block;
  file: string;
  sourceFile: string;
}

/** Templates and pages from packages/blocks/src/<slug>/<slug>.block.json, sorted by level then slug. */
export async function loadAllBlocks(): Promise<LoadedBlock[]> {
  const files = (await walk(join(ROOT, 'packages/blocks/src'))).filter((f) =>
    f.endsWith('.block.json'),
  );
  const out: LoadedBlock[] = [];
  for (const file of files) {
    const block = parseBlock(JSON.parse(await readFile(file, 'utf8')), file);
    out.push({ block, file, sourceFile: file.replace(/\.block\.json$/, '.tsx') });
  }
  return out.sort(
    (a, b) =>
      LEVEL_RANK[a.block.level] - LEVEL_RANK[b.block.level] ||
      a.block.slug.localeCompare(b.block.slug),
  );
}
