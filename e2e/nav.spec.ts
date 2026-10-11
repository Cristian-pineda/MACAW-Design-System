import { expect, test } from '@playwright/test';
import { blocks, blockUrl, componentSlugs, readManifest } from './helpers';

const LEVEL_GROUP: Record<string, string> = {
  atom: 'Atoms',
  molecule: 'Molecules',
  organism: 'Organisms',
  template: 'Templates',
  page: 'Pages',
};

test.describe('docs navigation', () => {
  test('shows the five component groups in atomic order', async ({ page }) => {
    await page.goto('/components', { waitUntil: 'networkidle' });
    const nav = page.getByRole('navigation', { name: 'Documentation', exact: true });
    const titles = await nav.locator(':scope > div > p').allTextContents();
    expect(titles).toEqual([
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

  test('lists each component under its manifest level and each block under its level', async ({
    page,
  }) => {
    await page.goto('/components', { waitUntil: 'networkidle' });
    const nav = page.getByRole('navigation', { name: 'Documentation', exact: true });
    const group = (title: string) =>
      nav
        .locator(':scope > div')
        .filter({ has: page.locator(':scope > p', { hasText: new RegExp(`^${title}$`) }) });

    const atoms = group('Atoms');
    await expect(atoms.locator('a').first()).toHaveAttribute('href', '/components');

    for (const slug of componentSlugs) {
      const level = readManifest(slug).level;
      const expected = LEVEL_GROUP[level];
      expect(expected, `${slug} has a known level`).toBeTruthy();
      await expect(
        group(expected!).locator(`a[href="/components/${slug}"]`),
        `${slug} under ${expected}`,
      ).toHaveCount(1);
      await expect(nav.locator(`a[href="/components/${slug}"]`)).toHaveCount(1);
    }

    for (const block of blocks) {
      await expect(
        group(LEVEL_GROUP[block.level]!).locator(`a[href="${blockUrl(block)}"]`),
      ).toHaveCount(1);
    }
  });
});
