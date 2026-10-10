import { render as rtlRender, type RenderOptions, type RenderResult } from '@testing-library/react';
import { expect } from 'vitest';
import type * as React from 'react';

export { axe } from 'jest-axe';
export { default as userEvent } from '@testing-library/user-event';
export { screen, within } from '@testing-library/react';

/** Renders inside a themed root so token-dependent assertions see the right attribute. */
export function render(
  ui: React.ReactElement,
  options: RenderOptions & { theme?: 'light' | 'dark' } = {},
): RenderResult {
  const { theme = 'light', ...rest } = options;
  document.documentElement.setAttribute('data-theme', theme);
  return rtlRender(ui, rest);
}

interface ManifestLike {
  props: Record<string, { type: string; values?: string[]; default?: unknown }>;
}
interface CvaLike {
  (props?: Record<string, unknown>): string;
}

/**
 * The manifest is the contract: every enum prop in it must exist in the cva config with the
 * same values and default, and every cva variant must be documented in the manifest.
 */
export function expectManifestMatchesVariants(
  manifest: ManifestLike,
  variants: CvaLike & { variantConfig?: unknown },
  config: {
    variants: Record<string, Record<string, string>>;
    defaultVariants?: Record<string, unknown>;
  },
) {
  for (const [name, values] of Object.entries(config.variants)) {
    const prop = manifest.props[name];
    expect(prop, `manifest is missing the "${name}" variant`).toBeDefined();
    expect(prop?.type, `"${name}" must be an enum in the manifest`).toBe('enum');
    expect([...(prop?.values ?? [])].sort(), `"${name}" values differ`).toEqual(
      Object.keys(values).sort(),
    );
    const def = config.defaultVariants?.[name];
    if (def !== undefined) expect(prop?.default, `"${name}" default differs`).toBe(def);
  }
  for (const [name, prop] of Object.entries(manifest.props)) {
    if (
      prop.type === 'enum' &&
      !(name in config.variants) &&
      name !== 'as' &&
      name !== 'type' &&
      name !== 'name'
    ) {
      expect.fail(`manifest prop "${name}" is an enum but has no cva variant`);
    }
  }
  expect(typeof variants({})).toBe('string');
}
