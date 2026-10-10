import { describe, expect, it } from 'vitest';
import { axe, render, screen, userEvent } from '../lib/test-utils.tsx';
import * as examples from './tab-nav.examples.tsx';
import { TabNav } from './tab-nav.tsx';

describe('TabNav', () => {
  it('is a named navigation landmark of links with aria-current on the active one', () => {
    render(
      <TabNav aria-label="Sections">
        <TabNav.Item href="/a" active>
          A
        </TabNav.Item>
        <TabNav.Item href="/b">B</TabNav.Item>
      </TabNav>,
    );
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'B' })).not.toHaveAttribute('aria-current');
    expect(screen.queryByRole('tablist')).toBeNull();
  });
  it('moves between tabs with Tab and uses the shared focus ring', async () => {
    const user = userEvent.setup();
    render(<examples.Default />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveFocus();
    await user.tab();
    const next = screen.getByRole('link', { name: 'Line items' });
    expect(next).toHaveFocus();
    expect(next.className).toContain('force-focus:outline-focus-ring');
  });
  it('never clips the focus ring with an overflow container', () => {
    const { container } = render(<examples.Default />);
    expect(container.querySelector('ul')?.className).not.toMatch(/overflow-/);
  });
  it('renders the child with asChild', () => {
    render(
      <TabNav aria-label="S">
        <TabNav.Item asChild active>
          <a href="/x" data-router="yes">
            X
          </a>
        </TabNav.Item>
      </TabNav>,
    );
    const link = screen.getByRole('link', { name: 'X' });
    expect(link).toHaveAttribute('data-router', 'yes');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
  it('renders every example without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const Example of Object.values(examples)) {
        const { container, unmount } = render(<Example />, { theme });
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      }
    }
  });
});
