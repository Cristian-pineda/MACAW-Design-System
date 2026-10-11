import { describe, expect, it } from 'vitest';
import { axe, render, screen, userEvent } from '../lib/test-utils.tsx';
import * as examples from './side-nav.examples.tsx';

describe('SideNav', () => {
  it('is a named landmark with exactly one current page', () => {
    render(<examples.Default />);
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toBeInTheDocument();
    const current = nav.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Invoices');
  });
  it('names each titled group list by its heading', () => {
    render(<examples.Default />);
    expect(screen.getByRole('list', { name: 'Billing' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Settings' })).toBeInTheDocument();
  });
  it('names items by their label, not their icon', () => {
    render(<examples.Default />);
    expect(screen.getByRole('link', { name: 'Payouts' })).toBeInTheDocument();
  });
  it('reaches every item with Tab and shows the shared focus ring', async () => {
    const user = userEvent.setup();
    render(<examples.WithoutIcons />);
    await user.tab();
    const first = screen.getByRole('link', { name: 'Color' });
    expect(first).toHaveFocus();
    expect(first.className).toContain('focus-visible:outline-focus-ring');
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
