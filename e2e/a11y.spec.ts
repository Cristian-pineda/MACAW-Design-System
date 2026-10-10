import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { componentSlugs, gotoThemed, themes } from './helpers';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const staticPages = ['/', '/components', '/tokens', '/getting-started', '/for-agents'];
const componentPages = componentSlugs.flatMap((slug) => [
  `/components/${slug}`,
  `/components/${slug}/gallery`,
]);

for (const theme of themes) {
  test.describe(`axe (${theme})`, () => {
    for (const url of [...staticPages, ...componentPages]) {
      test(`${url} has no violations`, async ({ page }) => {
        await gotoThemed(page, url, theme);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const summary = results.violations.map(
          (v) =>
            `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
        );
        expect(summary, summary.join('\n\n')).toEqual([]);
      });
    }
  });
}
