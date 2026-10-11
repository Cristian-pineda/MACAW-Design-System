/**
 * WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum): while tabbing through long pages at desktop
 * width, no focused element may be hidden behind the sticky TopBar or the PageHeader tab row.
 */
import { expect, test } from '@playwright/test';
import { applyDensity } from './helpers';

const longPages = [
  '/components/button',
  '/components/button/code',
  '/foundations/color/semantic',
  '/pages/invoice-record',
  '/tokens',
];

for (const density of ['comfortable', 'compact'] as const) {
  for (const url of longPages) {
    test(`${density}: focus never hides behind sticky chrome on ${url}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(url, { waitUntil: 'networkidle' });
      await applyDensity(page, density);
      const obscured: string[] = [];
      for (let i = 0; i < 80; i++) {
        await page.keyboard.press('Tab');
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          // Focus inside an embedded preview belongs to that document, which has its own checks.
          if (!el || el === document.body || el.tagName === 'IFRAME') return null;
          const rect = el.getBoundingClientRect();
          // The bottom edge of whatever sticky chrome is currently pinned at the top.
          let chromeBottom = 0;
          for (const c of document.querySelectorAll(
            'header[class*="sticky"], [data-page-header-tabs]',
          )) {
            const cs = getComputedStyle(c);
            if (cs.position !== 'sticky') continue;
            if (c.contains(el)) return null; // focus inside the chrome itself is always visible
            const cr = c.getBoundingClientRect();
            if (cr.top <= 0.5 + parseFloat(cs.top || '0'))
              chromeBottom = Math.max(chromeBottom, cr.bottom);
          }
          // Hidden only if the sticky chrome covers it: ask the browser what is on top at its centre.
          const cx = Math.min(Math.max(rect.left + rect.width / 2, 0), window.innerWidth - 1);
          const cy = rect.top + Math.min(rect.height / 2, 8);
          const top = cy >= 0 && cy < window.innerHeight ? document.elementFromPoint(cx, cy) : null;
          const coveredByChrome =
            top !== null &&
            !el.contains(top) &&
            top.closest('header, [data-page-header-tabs]') !== null;
          const hidden =
            (rect.bottom <= chromeBottom + 1 && getComputedStyle(el).position !== 'fixed') ||
            coveredByChrome;
          return hidden
            ? `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 30)}" bottom ${Math.round(rect.bottom)} ≤ chrome ${Math.round(chromeBottom)}`
            : null;
        });
        if (r) obscured.push(r);
      }
      expect(obscured).toEqual([]);
    });
  }
}
