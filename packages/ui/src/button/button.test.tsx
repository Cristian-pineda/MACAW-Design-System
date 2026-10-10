import { Icon } from '@macaw-ds/icons';
import { describe, expect, it, vi } from 'vitest';
import {
  axe,
  expectManifestMatchesVariants,
  render,
  screen,
  userEvent,
} from '../lib/test-utils.tsx';
import * as examples from './button.examples.tsx';
import manifest from './button.manifest.json';
import { Button, buttonVariants } from './button.tsx';

const variants = manifest.props.variant.values as Array<
  'primary' | 'secondary' | 'ghost' | 'destructive'
>;
const sizes = manifest.props.size.values as Array<'sm' | 'md' | 'lg'>;

describe('Button', () => {
  it('renders a type="button" with the label as its name', () => {
    render(<Button>Pay invoice</Button>);
    const btn = screen.getByRole('button', { name: 'Pay invoice' });
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('activates with mouse, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    await user.click(btn);
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    btn.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('is removed from the tab order when disabled or loading', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button disabled>A</Button>
        <Button loading>B</Button>
        <Button>C</Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
  });

  it('announces busy and keeps the label when loading', () => {
    render(<Button loading>Processing</Button>);
    const btn = screen.getByRole('button', { name: 'Processing' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled();
    expect(btn.querySelector('[data-icon="loader"]')).toBeInTheDocument();
  });

  it('takes its name from aria-label when icon-only', () => {
    render(
      <Button iconOnly aria-label="More actions" variant="ghost">
        <Icon name="more-horizontal" />
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('renders the child with asChild and never sets disabled on it', () => {
    render(
      <Button asChild disabled>
        <a href="/x">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders every variant, size and state without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(
        <div>
          {variants.map((variant) =>
            sizes.map((size) => (
              <div key={`${variant}-${size}`}>
                <Button variant={variant} size={size}>
                  {variant} {size}
                </Button>
                <Button variant={variant} size={size} disabled>
                  disabled
                </Button>
                <Button variant={variant} size={size} loading>
                  loading
                </Button>
              </div>
            )),
          )}
        </div>,
        { theme },
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });

  it('renders every example without axe violations', async () => {
    for (const Example of Object.values(examples)) {
      const { container, unmount } = render(<Example />);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });

  it('uses the shared focus ring', () => {
    render(<Button>Focus</Button>);
    expect(screen.getByRole('button').className).toContain('focus-visible:outline-focus-ring');
  });

  it('matches its manifest', () => {
    expectManifestMatchesVariants(manifest, buttonVariants, {
      variants: {
        variant: { primary: '', secondary: '', ghost: '', destructive: '' },
        size: { sm: '', md: '', lg: '' },
      },
      defaultVariants: { variant: 'primary', size: 'md' },
    });
  });
});
