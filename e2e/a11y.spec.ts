import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import {
  applyDensity,
  componentSlugs,
  componentTabUrls,
  foundationTabUrls,
  gotoThemed,
  staticPages,
  themes,
} from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const galleryPages = componentSlugs.map((slug) => `/components/${slug}/gallery`);
const pages = [...staticPages, ...componentTabUrls, ...galleryPages, ...foundationTabUrls];

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = results.violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
  );
  expect(summary, summary.join('\n\n')).toEqual([]);
}

for (const theme of themes) {
  test.describe(`axe (${theme})`, () => {
    for (const url of pages) {
      test(`${url} has no violations`, async ({ page }) => {
        await gotoThemed(page, url, theme);
        await expectNoViolations(page);
      });
    }
  });
}

test.describe('axe (compact density)', () => {
  for (const url of ['/components/button', '/foundations/layout/density']) {
    test(`${url} has no violations in compact`, async ({ page }) => {
      await applyDensity(page, 'compact');
      await gotoThemed(page, url, 'light');
      await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
      await expectNoViolations(page);
    });
  }
});
