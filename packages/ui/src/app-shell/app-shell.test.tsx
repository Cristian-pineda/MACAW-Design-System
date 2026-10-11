import { describe, expect, it } from 'vitest';
import { axe, render, screen, userEvent } from '../lib/test-utils.tsx';
import { AppShell } from './app-shell.tsx';
import * as examples from './app-shell.examples.tsx';

describe('AppShell', () => {
  it('provides banner, named complementary and main landmarks', () => {
    render(<examples.Default />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'example-main');
  });
  it('names main when mainLabel is given', () => {
    render(
      <AppShell topBar={<header>t</header>} mainLabel="Example app content">
        x
      </AppShell>,
    );
    expect(screen.getByRole('main', { name: 'Example app content' })).toBeInTheDocument();
  });
  it('makes the skip link the first Tab stop, targeting main', async () => {
    const user = userEvent.setup();
    render(<examples.Default />);
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#example-main');
  });
  it('gives the side column the full height below the TopBar on layer-1', () => {
    render(<examples.Default />);
    const cls = screen.getByRole('complementary').className;
    expect(cls).toContain('md:h-below-topbar');
    expect(cls).toContain('md:top-topbar');
    expect(cls).toContain('bg-surface-layer-1');
  });
  it('reflows below the 1024px floor: nothing sticky, side column stacks above main (WCAG 1.4.10)', () => {
    const { container } = render(<examples.Default />);
    const aside = screen.getByRole('complementary');
    expect(aside.className).not.toMatch(/(^|\s)sticky(\s|$)/);
    expect(aside.className).toContain('w-full');
    expect(screen.getByRole('banner').className).not.toMatch(/(^|\s)sticky(\s|$)/);
    expect(container.querySelector('[data-macaw-app-shell]')).not.toBeNull();
  });
  it('renders without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(<examples.Default />, { theme });
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
