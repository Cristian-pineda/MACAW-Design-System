import { expect, test, type Page } from '@playwright/test';
import {
  blockTabUrls,
  componentSlugs,
  componentTabUrls,
  foundationTabUrls,
  interactiveSlugs,
} from './helpers';

interface FocusInfo {
  tag: string;
  text: string;
  outlineStyle: string;
  outlineWidth: string;
}

const MAX_TABS = 60;

async function focusedInfo(page: Page): Promise<FocusInfo | null> {
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

/** Tabs through the first `count` stops of a docs page and asserts each focused element shows an outline. */
async function walkTabs(page: Page, count: number): Promise<FocusInfo[]> {
  const focused: FocusInfo[] = [];
  for (let i = 0; i < count; i += 1) {
    await page.keyboard.press('Tab');
    const info = await focusedInfo(page);
    if (!info) break;
    focused.push(info);
    expect(info.outlineStyle, `${info.tag} "${info.text}" has outline-style none`).not.toBe('none');
    expect(info.outlineWidth, `${info.tag} "${info.text}" has outline-width 0px`).not.toBe('0px');
  }
  return focused;
}

test.describe('docs shell', () => {
  test('the skip link is the first Tab stop and moves focus to main', async ({ page }) => {
    await page.goto('/components/button', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test('the density toggle sets data-density on html and persists', async ({ page }) => {
    await page.goto('/foundations/layout/density', { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-density', 'comfortable');
    const group = page.getByRole('radiogroup', { name: 'Density' });
    await group.getByRole('radio', { name: 'Compact' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('data-density', 'compact');
    await expect(group.getByRole('radio', { name: 'Compact' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});

for (const url of [...componentTabUrls, ...foundationTabUrls, ...blockTabUrls]) {
  test(`${url}: the current tab is marked and every focused element has a visible outline`, async ({
    page,
  }) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    // The docs PageHeader's tab row comes first; examples on the page may render their own.
    const current = page
      .locator('[data-page-header-tabs]')
      .first()
      .locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    expect(new URL(await current.evaluate((a) => (a as HTMLAnchorElement).href)).pathname).toBe(
      url,
    );
    const nav = page.getByRole('navigation', { name: 'Documentation', exact: true });
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    const focused = await walkTabs(page, 30);
    expect(focused.length).toBeGreaterThan(5);
  });
}
