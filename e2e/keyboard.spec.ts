import { expect, test } from '@playwright/test';
import { componentSlugs, interactiveSlugs } from './helpers';

interface FocusInfo {
  tag: string;
  text: string;
  outlineStyle: string;
  outlineWidth: string;
}

const MAX_TABS = 60;

async function focusedInfo(page: import('@playwright/test').Page): Promise<FocusInfo | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body || el === document.documentElement) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40),
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
    };
  });
}

for (const slug of componentSlugs) {
  test(`/components/${slug}/gallery: every focused element has a visible outline`, async ({
    page,
  }) => {
    await page.goto(`/components/${slug}/gallery`, { waitUntil: 'networkidle' });
    // The "Focused" row focuses an element near the end of the page on mount, which also moves the browser's
    // sequential-focus starting point there. Park focus on a sentinel at the top so Tab walks the whole page.
    await page.evaluate(() => {
      const sentinel = document.createElement('div');
      sentinel.tabIndex = -1;
      sentinel.setAttribute('data-test-sentinel', '');
      document.body.prepend(sentinel);
      sentinel.focus();
    });

    const focused: FocusInfo[] = [];
    for (let i = 0; i < MAX_TABS; i += 1) {
      await page.keyboard.press('Tab');
      const info = await focusedInfo(page);
      if (!info) break; // focus left the document (end of the tab order)
      focused.push(info);
      expect(
        info.outlineStyle,
        `${info.tag} "${info.text}" has outline-style ${info.outlineStyle}`,
      ).not.toBe('none');
      expect(
        info.outlineWidth,
        `${info.tag} "${info.text}" has outline-width ${info.outlineWidth}`,
      ).not.toBe('0px');
    }

    if (interactiveSlugs.includes(slug)) {
      expect(
        focused.length,
        `expected at least one focusable element in the ${slug} gallery`,
      ).toBeGreaterThan(0);
    }
  });
}

test('/components/button/gallery: Enter and Space activate a focused button without errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/components/button/gallery', { waitUntil: 'networkidle' });

  const button = page.locator('button:not([disabled])').first();
  await button.focus();
  await expect(button).toBeFocused();

  const activations = await page.evaluate(() => {
    const el = document.activeElement as HTMLButtonElement;
    let count = 0;
    el.addEventListener('click', () => {
      count += 1;
    });
    (window as unknown as { __count: () => number }).__count = () => count;
    return count;
  });
  expect(activations).toBe(0);

  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  const count = await page.evaluate(() =>
    (window as unknown as { __count: () => number }).__count(),
  );
  expect(count).toBe(2);
  await expect(button).toBeFocused();
  expect(errors).toEqual([]);
});
