import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseManifest, type Level, type Manifest } from '@macaw-ds/manifest';
import registryJson from '../../../registry/registry.json';
import { REGISTRY_DIR } from './paths';

export type RegistryStatus = 'planned' | 'alpha' | 'beta' | 'stable' | 'deprecated';

export interface RegistryItemMeta {
  version: string;
  package: string;
  status: RegistryStatus;
  category: string;
  since: string;
  /** Atomic design level. Optional until every registry build carries it. */
  level?: Level;
  exports: string[];
  budget: { gzip: number };
  file: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files?: { path: string; type: string; target: string }[];
  meta?: { macaw?: RegistryItemMeta };
}

export interface ComponentSummary {
  slug: string;
  title: string;
  purpose: string;
  status: RegistryStatus;
  category: string;
  level: Level;
  package: string;
}

const registry = registryJson as unknown as {
  items: RegistryItem[];
  meta: { macaw: { version: string; components: string[] } };
};

export function getRegistry() {
  return registry;
}

/** Every `registry:ui` item, in registry order. */
export function getComponentItems(): RegistryItem[] {
  return registry.items.filter((item) => item.type === 'registry:ui');
}

/** Levels in atomic design order, and their plural labels for headings and nav groups. */
export const COMPONENT_LEVELS = ['atom', 'molecule', 'organism', 'template'] as const;
export const LEVEL_LABEL: Record<Level | 'page', { one: string; many: string }> = {
  atom: { one: 'Atom', many: 'Atoms' },
  molecule: { one: 'Molecule', many: 'Molecules' },
  organism: { one: 'Organism', many: 'Organisms' },
  template: { one: 'Template', many: 'Templates' },
  page: { one: 'Page', many: 'Pages' },
};

const levelCache = new Map<string, Level>();

/**
 * The component's atomic level: `meta.macaw.level` on the registry item when the registry carries
 * it, otherwise the `level` field of registry/manifests/<slug>.json.
 */
export function getComponentLevel(item: RegistryItem): Level {
  const fromRegistry = item.meta?.macaw?.level;
  if (fromRegistry) return fromRegistry;
  const cached = levelCache.get(item.name);
  if (cached) return cached;
  const manifest = parseManifest(
    JSON.parse(readFileSync(path.join(REGISTRY_DIR, 'manifests', `${item.name}.json`), 'utf8')),
    item.name,
  );
  levelCache.set(item.name, manifest.level);
  return manifest.level;
}

export function getComponentSummaries(): ComponentSummary[] {
  return getComponentItems().map((item) => ({
    slug: item.name,
    title: item.title,
    purpose: item.description,
    status: item.meta?.macaw?.status ?? 'beta',
    category: item.meta?.macaw?.category ?? 'primitive',
    level: getComponentLevel(item),
    package: item.meta?.macaw?.package ?? '@macaw-ds/ui',
  }));
}

export function getComponentSlugs(): string[] {
  return getComponentItems().map((item) => item.name);
}

/** All item names that `/r/<name>.json` serves (components, macaw-lib, tokens). */
export function getRegistryItemNames(): string[] {
  return registry.items.map((item) => item.name);
}

export async function getManifest(slug: string): Promise<Manifest> {
  const raw = JSON.parse(
    await readFile(path.join(REGISTRY_DIR, 'manifests', `${slug}.json`), 'utf8'),
  ) as unknown;
  return parseManifest(raw, slug);
}

export async function readRegistryItemJson(name: string): Promise<string> {
  const file =
    name === 'registry'
      ? path.join(REGISTRY_DIR, 'registry.json')
      : path.join(REGISTRY_DIR, 'r', `${name}.json`);
  return readFile(file, 'utf8');
}
