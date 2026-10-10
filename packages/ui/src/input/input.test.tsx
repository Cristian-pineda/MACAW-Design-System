import { describe, expect, it } from 'vitest';
import {
  axe,
  expectManifestMatchesVariants,
  render,
  screen,
  userEvent,
} from '../lib/test-utils.tsx';
import * as examples from './input.examples.tsx';
import manifest from './input.manifest.json';
import { Input, inputVariants } from './input.tsx';

describe('Input', () => {
  it('is labelled by a visible label', () => {
    render(
      <>
        <label htmlFor="a">Amount</label>
        <Input id="a" />
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Amount' })).toBeInTheDocument();
  });
  it('accepts typing and reaches focus by Tab', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Ref" />);
    await user.tab();
    const box = screen.getByRole('textbox', { name: 'Ref' });
    expect(box).toHaveFocus();
    await user.keyboard('INV-1');
    expect(box).toHaveValue('INV-1');
  });
  it('sets aria-invalid when invalid', () => {
    render(<Input aria-label="E" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
  it('leaves the tab order when disabled but not when read-only', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Input aria-label="D" disabled />
        <Input aria-label="R" readOnly />
      </>,
    );
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'R' })).toHaveFocus();
  });
  it('hides adornments from assistive technology', () => {
    const { container } = render(<Input aria-label="Amt" startAdornment="$" endAdornment="USD" />);
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(2);
    expect(screen.getByRole('textbox').className).toContain('pl-9');
  });
  it('renders every size and state without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(
        <div>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <div key={size}>
              <Input size={size} aria-label={`${size} default`} />
              <Input size={size} aria-label={`${size} invalid`} invalid />
              <Input size={size} aria-label={`${size} disabled`} disabled />
              <Input size={size} aria-label={`${size} readonly`} readOnly />
              <Input size={size} aria-label={`${size} amount`} align="end" startAdornment="$" />
            </div>
          ))}
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
    expectManifestMatchesVariants(manifest, inputVariants, {
      variants: { size: { sm: '', md: '', lg: '' }, align: { start: '', end: '' } },
      defaultVariants: { size: 'md', align: 'start' },
    });
  });
});
