import { describe, expect, it } from 'vitest';
import { axe, expectManifestMatchesVariants, render, screen } from '../lib/test-utils.tsx';
import * as examples from './badge.examples.tsx';
import manifest from './badge.manifest.json';
import { Badge, badgeVariants, type BadgeTone } from './badge.tsx';

const tones = manifest.props.tone.values as BadgeTone[];
const variants = manifest.props.variant.values as Array<'soft' | 'solid' | 'outline'>;

describe('Badge', () => {
  it('renders its text with no role', () => {
    render(<Badge tone="success">Paid</Badge>);
    const el = screen.getByText('Paid');
    expect(el.tagName).toBe('SPAN');
    expect(el).not.toHaveAttribute('role');
  });
  it('renders a decorative dot', () => {
    const { container } = render(<Badge dot>Active</Badge>);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });
  it('is not focusable', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).not.toHaveAttribute('tabindex');
  });
  it('renders every tone and variant without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(
        <div>
          {tones.map((tone) =>
            variants.map((variant) => (
              <Badge key={`${tone}-${variant}`} tone={tone} variant={variant} dot>
                {tone} {variant}
              </Badge>
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
    expectManifestMatchesVariants(manifest, badgeVariants, {
      variants: {
        tone: Object.fromEntries(tones.map((t) => [t, ''])),
        variant: { soft: '', solid: '', outline: '' },
        size: { sm: '', md: '' },
      },
      defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
    });
  });
});
