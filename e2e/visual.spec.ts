import { expect, test } from '@playwright/test';
import { blocks, componentSlugs } from './helpers';

// Baselines in e2e/__screenshots__ are Linux renders from the Playwright container in CI
// (run the e2e workflow with update-baselines to refresh them). Fonts rasterise differently on
// macOS and Windows, so comparing there reports false failures: visual checks run on Linux only.
// Every other e2e check (axe, keyboard, reflow, focus) runs everywhere.
test.skip(
  process.platform !== 'linux',
  'Visual baselines are Linux renders; run in CI, or locally inside mcr.microsoft.com/playwright.',
);

for (const slug of componentSlugs) {
  test(`gallery ${slug} matches the baseline`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`/components/${slug}/gallery`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  });
}

// Templates and pages: the preview document (real AppShell + block), light and comfortable.
for (const block of blocks) {
  test(`${block.level} ${block.slug} matches the baseline`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`/preview/${block.level}/${block.slug}?theme=light&density=comfortable`, {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${block.level}-${block.slug}.png`, { fullPage: true });
  });
}
