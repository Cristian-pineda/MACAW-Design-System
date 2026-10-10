import { parseManifest, type Manifest } from './schema.ts';

export interface LoadedManifest {
  manifest: Manifest;
  file: string;
}

/** Reads and validates manifest files. Throws on the first invalid one with a readable message. */
export async function loadManifests(files: string[]): Promise<LoadedManifest[]> {
  const { readFile } = await import('node:fs/promises');
  const out: LoadedManifest[] = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(file, 'utf8')) as unknown;
    out.push({ manifest: parseManifest(raw, file), file });
  }
  return out.sort((a, b) => a.manifest.slug.localeCompare(b.manifest.slug));
}

/** Infers the playground control for a prop when the manifest does not name one. */
export function inferControl(
  prop: Manifest['props'][string],
): 'segmented' | 'select' | 'switch' | 'text' | 'number' | 'none' {
  if (prop.control) return prop.control;
  switch (prop.type) {
    case 'enum':
      return (prop.values?.length ?? 0) <= 4 ? 'segmented' : 'select';
    case 'boolean':
      return 'switch';
    case 'string':
    case 'node':
      return 'text';
    case 'number':
      return 'number';
    default:
      return 'none';
  }
}
