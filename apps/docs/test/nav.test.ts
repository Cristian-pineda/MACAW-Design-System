import { describe, expect, it } from 'vitest';
import { navGroups } from '../components/shell/nav';
import { getBlocks } from '../lib/blocks';
import { getComponentSummaries, LEVEL_LABEL } from '../lib/registry';

const components = getComponentSummaries();
const blocks = getBlocks();
const groups = navGroups(components, blocks);

describe('navGroups', () => {
  it('has the five atomic groups in order between Foundations and Reference', () => {
    expect(groups.map((g) => g.title)).toEqual([
      'Start',
      'Foundations',
      'Atoms',
      'Molecules',
      'Organisms',
      'Templates',
      'Pages',
      'Reference',
    ]);
  });

  it('opens Atoms with the components overview', () => {
    expect(groups.find((g) => g.title === 'Atoms')?.links[0]).toEqual({
      href: '/components',
      label: 'All components',
      exact: true,
    });
  });

  it('lists every component under its manifest level', () => {
    for (const c of components) {
      const group = groups.find((g) => g.title === LEVEL_LABEL[c.level].many);
      expect(
        group?.links.map((l) => l.href),
        `${c.slug} under ${c.level}`,
      ).toContain(`/components/${c.slug}`);
    }
  });

  it('lists template blocks under Templates and page blocks under Pages', () => {
    expect(blocks.length).toBeGreaterThanOrEqual(7);
    for (const b of blocks) {
      const group = groups.find((g) => g.title === LEVEL_LABEL[b.level].many);
      expect(group?.links.map((l) => l.href)).toContain(`/${b.level}s/${b.slug}`);
    }
  });

  it('every page block names a template block that exists', () => {
    const templates = new Set(blocks.filter((b) => b.level === 'template').map((b) => b.slug));
    for (const b of blocks.filter((b) => b.level === 'page')) {
      expect(templates, `${b.slug} fills ${b.template}`).toContain(b.template);
    }
  });
});
