import { describe, expect, it } from 'vitest';
import { axe, expectManifestMatchesVariants, render, screen } from '../lib/test-utils.tsx';
import * as examples from './page-header.examples.tsx';
import manifest from './page-header.manifest.json';
import { PageHeader } from './page-header.tsx';

describe('PageHeader', () => {
  it('renders the title as the page h1 by default', () => {
    render(<examples.Default />);
    expect(screen.getByRole('heading', { level: 1, name: 'Invoices' })).toBeInTheDocument();
  });
  it('honours headingLevel', () => {
    render(<PageHeader title="Nested" headingLevel="h2" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Nested' })).toBeInTheDocument();
  });
  it('renders tabs in a sticky row below the TopBar', () => {
    const { container } = render(<examples.Record />);
    const row = container.querySelector('[data-page-header-tabs]');
    expect(row?.className).toContain('md:sticky');
    expect(row?.className).toContain('md:top-topbar');
    expect(screen.getByRole('navigation', { name: 'Invoice sections' })).toBeInTheDocument();
  });
  it('has one primary action in the examples', () => {
    render(<examples.Record />);
    const primaries = screen
      .getAllByRole('button')
      .filter((b) => b.className.includes('bg-action-primary'));
    expect(primaries).toHaveLength(1);
  });
  it('renders every example without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const Example of Object.values(examples)) {
        const { container, unmount } = render(<main>{<Example />}</main>, { theme });
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      }
    }
  });
  it('matches its manifest', () => {
    expectManifestMatchesVariants(manifest, () => '', {
      variants: { headingLevel: { h1: '', h2: '' } },
      defaultVariants: { headingLevel: 'h1' },
    });
  });
});
