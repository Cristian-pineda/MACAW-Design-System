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

export interface ManifestJson {
  slug: string;
  props: Record<string, { type: string; control?: string; default?: unknown }>;
  a11y: { focusable: boolean | { whenProp: string } };
  motion?: { description: string; tokens: string[]; whenProp?: string };
}

/** The manifest as the registry serves it (registry/manifests/<slug>.json). */
export function readManifest(slug: string): ManifestJson {
  return JSON.parse(
    readFileSync(path.resolve(here, `../registry/manifests/${slug}.json`), 'utf8'),
  ) as ManifestJson;
}

/** Slugs whose galleries contain focusable elements (the shell parts render links and buttons). */
export const interactiveSlugs = componentSlugs.filter((slug) =>
  [
    'button',
    'input',
    'card',
    'app-shell',
    'page-header',
    'side-nav',
    'tab-nav',
    'top-bar',
  ].includes(slug),
);

/** Component pages: one URL per tab. */
export const componentTabSuffixes = ['', '/usage', '/accessibility', '/code'] as const;
export const componentTabUrls = componentSlugs.flatMap((slug) =>
  componentTabSuffixes.map((suffix) => `/components/${slug}${suffix}`),
);

/** Foundation pages: one URL per tab, the first is the base URL. Mirrors components/shell/nav.ts. */
export const foundationTabUrls = [
  '/foundations/color',
  '/foundations/color/palette',
  '/foundations/color/semantic',
  '/foundations/color/surfaces',
  '/foundations/color/accessibility',
  '/foundations/typography',
  '/foundations/typography/scale',
  '/foundations/typography/numerals',
  '/foundations/typography/usage',
  '/foundations/spacing',
  '/foundations/spacing/scale',
  '/foundations/spacing/usage',
  '/foundations/layout',
  '/foundations/layout/density',
  '/foundations/layout/templates',
  '/foundations/layout/containers',
  '/foundations/elevation',
  '/foundations/elevation/surfaces',
  '/foundations/elevation/shadows',
  '/foundations/elevation/z-index',
  '/foundations/motion',
  '/foundations/motion/tokens',
  '/foundations/motion/reduced-motion',
  '/foundations/accessibility',
  '/foundations/accessibility/color',
  '/foundations/accessibility/keyboard',
  '/foundations/accessibility/developers',
];

export const staticPages = ['/', '/components', '/tokens', '/getting-started', '/for-agents'];

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

/** Stores a docs density preference before the page loads (read by the inline script in <head>). */
export async function applyDensity(page: Page, density: 'comfortable' | 'compact'): Promise<void> {
  await page.addInitScript((value: string) => {
    try {
      window.localStorage.setItem('macaw-density', value);
    } catch {
      // ignore
    }
  }, density);
}

export async function gotoThemed(page: Page, url: string, theme: Theme): Promise<void> {
  await applyTheme(page, theme);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector(`html[data-theme="${theme}"]`, { timeout: 10_000 });
}
