import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(
  readFileSync(path.resolve(here, '../registry/registry.json'), 'utf8'),
) as {
  items: { name: string; type: string }[];
};

/** Every `registry:ui` slug, read from the generated registry so new components are covered automatically. */
export const componentSlugs = registry.items
  .filter((item) => item.type === 'registry:ui')
  .map((item) => item.name);

/** Slugs whose galleries contain focusable elements. */
export const interactiveSlugs = componentSlugs.filter((slug) =>
  ['button', 'input', 'card'].includes(slug),
);

export type Theme = 'light' | 'dark';
export const themes: Theme[] = ['light', 'dark'];

/** Sets the theme two ways: the OS preference and next-themes' localStorage key, before the page loads. */
export async function applyTheme(page: Page, theme: Theme): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.addInitScript((value: string) => {
    try {
      window.localStorage.setItem('theme', value);
    } catch {
      // ignore: storage can be unavailable in some contexts
    }
  }, theme);
}

export async function gotoThemed(page: Page, url: string, theme: Theme): Promise<void> {
  await applyTheme(page, theme);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(`html[data-theme="${theme}"]`, { timeout: 10_000 });
}
