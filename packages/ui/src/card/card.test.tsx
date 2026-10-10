import { describe, expect, it, vi } from 'vitest';
import {
  axe,
  expectManifestMatchesVariants,
  render,
  screen,
  userEvent,
} from '../lib/test-utils.tsx';
import * as examples from './card.examples.tsx';
import manifest from './card.manifest.json';
import { Card, cardVariants } from './card.tsx';

describe('Card', () => {
  it('renders a static card with no role and a level-3 title by default', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Volume</Card.Title>
        </Card.Header>
        <Card.Body>Body</Card.Body>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Volume' })).toBeInTheDocument();
    expect(screen.getByText('Body').closest('[tabindex]')).toBeNull();
  });
  it('lets the title choose its heading level', () => {
    render(
      <Card>
        <Card.Title as="h2">Section</Card.Title>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
  it('passes padding to its sections', () => {
    render(
      <Card padding="sm">
        <Card.Body>B</Card.Body>
      </Card>,
    );
    expect(screen.getByText('B').className).toContain('px-card-x-sm');
    render(
      <Card padding="none">
        <Card.Body>N</Card.Body>
      </Card>,
    );
    expect(screen.getByText('N').className).not.toContain('px-');
  });
  it('is keyboard-operable when interactive via asChild', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <Card interactive asChild>
        <a href="/x" onClick={onClick}>
          <Card.Body>Open</Card.Body>
        </a>
      </Card>,
    );
    await user.tab();
    const link = screen.getByRole('link', { name: 'Open' });
    expect(link).toHaveFocus();
    expect(link.className).toContain('focus-visible:outline-focus-ring');
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
  it('renders every variant without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(
        <div>
          {(['flat', 'raised'] as const).map((elevation) =>
            (['none', 'sm', 'md'] as const).map((padding) => (
              <Card key={`${elevation}-${padding}`} elevation={elevation} padding={padding}>
                <Card.Header>
                  <Card.Title>{elevation}</Card.Title>
                </Card.Header>
                <Card.Body>{padding}</Card.Body>
                <Card.Footer>footer</Card.Footer>
              </Card>
            )),
          )}
        </div>,
        { theme },
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
  it('renders every example', async () => {
    for (const Example of Object.values(examples)) {
      const { container, unmount } = render(<Example />);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
  it('matches its manifest', () => {
    expectManifestMatchesVariants(manifest, cardVariants, {
      variants: { elevation: { flat: '', raised: '' }, padding: { none: '', sm: '', md: '' } },
      defaultVariants: { elevation: 'flat', padding: 'md' },
    });
  });
});
