import type * as React from 'react';
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

  it('removes disabled buttons from the tab order but keeps loading ones focusable', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button disabled>A</Button>
        <Button loading>B</Button>
        <Button>C</Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
  });

  it('keeps keyboard focus when an action starts loading, and ignores activation while busy', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Pay</Button>);
    const btn = screen.getByRole('button', { name: 'Pay' });
    btn.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <Button onClick={onClick} loading>
        Pay
      </Button>,
    );
    expect(btn).toHaveFocus();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not submit a form while loading', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Save
        </Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('announces busy and keeps the label when loading', () => {
    render(<Button loading>Processing</Button>);
    const btn = screen.getByRole('button', { name: 'Processing' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).not.toBeDisabled();
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

  it('renders the child with asChild, and a disabled link does not navigate', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild disabled onClick={onClick}>
        <a href="#x">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    const before = window.location.hash;
    await user.click(link);
    expect(window.location.hash).toBe(before);
    expect(onClick).not.toHaveBeenCalled();
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

  it('uses the shared focus ring, including the force-focus variant used by previews', () => {
    render(<Button>Focus</Button>);
    const cls = screen.getByRole('button').className;
    expect(cls).toContain('focus-visible:outline-focus-ring');
    expect(cls).toContain('force-focus:outline-focus-ring');
  });

  it('spins only through the animation token so reduced motion can stop it', () => {
    render(<Button loading>Busy</Button>);
    const spinner = screen.getByRole('button').querySelector('[data-icon="loader"]');
    expect(spinner?.getAttribute('class')).toContain('animate-spin');
    expect(spinner?.getAttribute('class')).not.toMatch(/motion-(reduce|safe):/);
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
