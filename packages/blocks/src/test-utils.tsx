import { parseBlock } from '@macaw-ds/manifest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import type * as React from 'react';
import { describe, expect, it } from 'vitest';

const PRIMARY = /(^|\s)bg-action-primary(\s|$)/;

/**
 * The contract every block shares: a valid manifest whose exports exist, main-area content only
 * (no main, banner or contentinfo), exactly one h1, named navigation landmarks, at most one
 * primary Button, and no axe violations in light and dark.
 */
export function describeBlock(
  manifestJson: unknown,
  module: Record<string, unknown>,
  Block: React.ComponentType,
) {
  const manifest = parseBlock(manifestJson);

  describe(`${manifest.name} (${manifest.level})`, () => {
    it('has a valid manifest whose exports exist', () => {
      for (const name of manifest.exports) {
        expect(typeof module[name], `${name} is not exported`).toBe('function');
      }
      if (manifest.level === 'page') expect(manifest.template).toBeTruthy();
    });

    it('renders exactly one h1', () => {
      render(<Block />);
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

    it('renders main-area content only, with named landmarks', () => {
      render(<Block />);
      for (const role of ['main', 'banner', 'contentinfo', 'complementary'] as const) {
        expect(screen.queryAllByRole(role), `unexpected ${role} landmark`).toHaveLength(0);
      }
      for (const nav of screen.queryAllByRole('navigation')) {
        expect(nav).toHaveAccessibleName();
      }
    });

    it('has at most one primary Button', () => {
      render(<Block />);
      const primaries = screen
        .queryAllByRole('button')
        .filter((button) => PRIMARY.test(button.className));
      expect(primaries.length).toBeLessThanOrEqual(1);
    });

    it('has no axe violations in light and dark', async () => {
      for (const theme of ['light', 'dark'] as const) {
        document.documentElement.setAttribute('data-theme', theme);
        const { container, unmount } = render(
          <main>
            <Block />
          </main>,
        );
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      }
      document.documentElement.removeAttribute('data-theme');
    });
  });
}
