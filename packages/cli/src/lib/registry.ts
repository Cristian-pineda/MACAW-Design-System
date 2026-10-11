import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { registryDir } from './paths.ts';

export interface RegistryIndex {
  name: string;
  homepage: string;
  items: Array<{
    name: string;
    type: string;
    title: string;
    description: string;
    meta?: { macaw?: { version: string; package: string; status: string; exports?: string[] } };
  }>;
  meta: { macaw: { version: string; scope: string; components: string[]; blocks?: string[] } };
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: Array<{ path: string; type: string; target: string; content: string }>;
  docs?: string;
  meta?: { macaw?: { version: string; manifest?: unknown } };
}

export async function loadIndex(): Promise<RegistryIndex> {
  return JSON.parse(await readFile(join(registryDir(), 'registry.json'), 'utf8')) as RegistryIndex;
}

export async function loadItem(name: string): Promise<RegistryItem> {
  return JSON.parse(
    await readFile(join(registryDir(), 'r', `${name}.json`), 'utf8'),
  ) as RegistryItem;
}
