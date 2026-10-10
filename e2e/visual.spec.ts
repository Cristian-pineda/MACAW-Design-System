import { expect, test } from '@playwright/test';
import { componentSlugs } from './helpers';

// Baselines are generated in CI (workflow_dispatch with update-baselines) inside the Playwright container;
// e2e/__screenshots__ is intentionally empty in the repository until then.
for (const slug of componentSlugs) {
  test(`gallery ${slug} matches the baseline`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`/components/${slug}/gallery`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  });
}
