import { describe, expect, it } from 'vitest';
import { axe, render, screen } from '../lib/test-utils.tsx';
import * as examples from './top-bar.examples.tsx';

describe('TopBar', () => {
  it('renders a banner with brand, centre and actions', () => {
    render(<examples.Default />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Perch')).toBeInTheDocument();
    expect(screen.getByText('Test mode')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });
  it('uses the topbar height token and layer-1', () => {
    render(<examples.Default />);
    const cls = screen.getByRole('banner').className;
    expect(cls).toContain('h-topbar');
    expect(cls).toContain('md:sticky');
    expect(cls).toContain('bg-surface-layer-1');
  });
  it('renders without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(<examples.Default />, { theme });
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
