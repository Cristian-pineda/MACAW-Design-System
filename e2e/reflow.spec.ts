/**
 * WCAG 2.2 SC 1.4.10 Reflow: at 320 CSS px wide (a 400% zoom on a 1280 px screen) no page may
 * scroll horizontally. Code blocks and tables may scroll inside their own focusable region.
 */
import { expect, test } from '@playwright/test';
import {
  blockPreviewUrls,
  blockTabUrls,
  componentTabUrls,
  foundationTabUrls,
  staticPages,
} from './helpers';

const routes = [
  ...staticPages,
  ...foundationTabUrls,
  ...componentTabUrls,
  ...blockTabUrls,
  ...blockPreviewUrls,
];

test.use({ viewport: { width: 320, height: 640 } });

for (const url of routes) {
  test(`reflows at 320px: ${url}`, async ({ page }) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    const result = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const vw = document.documentElement.clientWidth;
      // Elements that stick out past the viewport, outside any horizontally scrollable ancestor.
      const offenders: string[] = [];
      const scrollsX = (el: Element | null): boolean => {
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          const o = getComputedStyle(n).overflowX;
          if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > vw + 1 && !scrollsX(el.parentElement)) {
          offenders.push(
            `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${String(el.className).slice(0, 60)} → ${Math.round(r.right)}px`,
          );
        }
      }
      return { docWidth, vw, offenders: offenders.slice(0, 5) };
    });
    expect(result.offenders, `elements wider than ${result.vw}px`).toEqual([]);
    expect(result.docWidth, 'page scroll width').toBeLessThanOrEqual(result.vw + 1);
  });
}

test('horizontally scrollable regions are reachable by keyboard (axe scrollable-region-focusable)', async ({
  page,
}) => {
  for (const url of [
    '/components/button/code',
    '/tokens',
    '/foundations/color/semantic',
    '/pages/invoice-record/code',
  ]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const unreachable = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((el) => {
          const cs = getComputedStyle(el);
          return (
            (cs.overflowX === 'auto' || cs.overflowX === 'scroll') &&
            el.scrollWidth > el.clientWidth + 1
          );
        })
        .filter((el) => {
          const focusableSelf = (el as HTMLElement).tabIndex >= 0;
          const focusableChild = el.querySelector(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          return !focusableSelf && !focusableChild;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`),
    );
    expect(unreachable, url).toEqual([]);
  }
});

test('block previews are titled iframes with one h1 per document', async ({ page }) => {
  for (const url of ['/pages/billing-dashboard', '/templates/record-template']) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const iframe = page.locator('[data-testid="block-frame"] iframe');
    await expect(iframe).toHaveAttribute('title', /preview/);
    expect(await page.locator('h1').count(), `${url} outer h1s`).toBe(1);
    const frame = page.frameLocator('[data-testid="block-frame"] iframe');
    await expect(frame.locator('h1')).toHaveCount(1);
    await expect(frame.getByRole('main')).toHaveCount(1);
  }
});
