import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentMapSlugs } from '../components/playground/component-map';

const registry = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../../registry/registry.json'), 'utf8'),
) as {
  items: { name: string; type: string }[];
};
const registrySlugs = registry.items
  .filter((item) => item.type === 'registry:ui')
  .map((item) => item.name);

describe('component-map', () => {
  it('has an entry for every registry:ui item', () => {
    for (const slug of registrySlugs)
      expect(componentMapSlugs, `missing playground entry for "${slug}"`).toContain(slug);
  });

  it('has no entry that is not in the registry', () => {
    for (const slug of componentMapSlugs)
      expect(registrySlugs, `"${slug}" is in component-map but not in registry.json`).toContain(
        slug,
      );
  });

  it('matches the registry exactly', () => {
    expect([...componentMapSlugs].sort()).toEqual([...registrySlugs].sort());
  });
});
