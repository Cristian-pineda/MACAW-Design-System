import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function registryDir(): string {
  if (process.env.MACAW_REGISTRY_DIR) return process.env.MACAW_REGISTRY_DIR;
  const here = dirname(fileURLToPath(import.meta.url));
  for (const c of [
    join(here, '..', 'registry'),
    join(here, '..', '..', 'registry'),
    join(here, '..', '..', '..', '..', 'registry'),
  ]) {
    if (existsSync(join(c, 'registry.json'))) return c;
  }
  throw new Error('MACAW registry not found. Reinstall @macaw-ds/mcp or set MACAW_REGISTRY_DIR.');
}

export interface IndexItem {
  name: string;
  type: string;
  title: string;
  description: string;
  meta?: {
    macaw?: {
      version: string;
      package: string;
      status: string;
      category: string;
      since: string;
      exports: string[];
      budget: { gzip: number };
    };
  };
}
export interface Index {
  homepage: string;
  items: IndexItem[];
  meta: { macaw: { version: string; scope: string; components: string[] } };
}
export interface TokenEntry {
  name: string;
  cssVar: string;
  path: string[];
  type: string;
  tier: string;
  description?: string;
  value: { light: unknown; dark: unknown };
  themed: boolean;
}

const json = async <T>(p: string): Promise<T> => JSON.parse(await readFile(p, 'utf8')) as T;

export const loadIndex = () => json<Index>(join(registryDir(), 'registry.json'));
export const loadManifest = (slug: string) =>
  json<Record<string, unknown>>(join(registryDir(), 'manifests', `${slug}.json`));
export const loadTokens = () =>
  json<{ version: string; prefix: string; tokens: TokenEntry[] }>(
    join(registryDir(), 'tokens.json'),
  );
export const listManifests = async () =>
  (await readdir(join(registryDir(), 'manifests')))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));

/** A template or page: its manifest, install command and consumer-shaped source, or undefined. */
export async function loadBlock(slug: string) {
  const path = join(registryDir(), 'r', `${slug}.json`);
  if (!existsSync(path)) return undefined;
  const item = await json<{
    type: string;
    files: Array<{ target: string; content: string }>;
    meta?: { macaw?: { block?: unknown } };
  }>(path);
  if (item.type !== 'registry:block') return undefined;
  return {
    kind: 'block',
    manifest: item.meta?.macaw?.block,
    install: `npx @macaw-ds/cli add ${slug}`,
    target: item.files[0]?.target,
    source: item.files[0]?.content,
  };
}
