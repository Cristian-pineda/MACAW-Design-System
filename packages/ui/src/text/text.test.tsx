import { describe, expect, it } from 'vitest';
import { axe, expectManifestMatchesVariants, render, screen } from '../lib/test-utils.tsx';
import manifest from './text.manifest.json';
import { Text, textVariants } from './text.tsx';
import * as examples from './text.examples.tsx';

const roles = manifest.props.variant.values as Array<
  Parameters<typeof textVariants>[0] extends infer P
    ? P extends { variant?: infer R }
      ? NonNullable<R>
      : never
    : never
>;

describe('Text', () => {
  it('renders a paragraph by default and honours `as`', () => {
    render(<Text>Hello</Text>);
    expect(screen.getByText('Hello').tagName).toBe('P');
    render(<Text as="h2">Title</Text>);
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
  });
  it('switches to tabular numerals and the numeric tone', () => {
    render(<Text numeric>$1.00</Text>);
    const el = screen.getByText('$1.00');
    expect(el.className).toContain('tabular-nums');
    expect(el.className).toContain('text-fg-numeric');
  });
  it('keeps an explicit tone when numeric', () => {
    render(
      <Text numeric tone="critical">
        -$1.00
      </Text>,
    );
    expect(screen.getByText('-$1.00').className).toContain('text-status-critical-fg');
  });
  it('associates labels with controls', () => {
    render(
      <>
        <Text as="label" htmlFor="amount">
          Amount
        </Text>
        <input id="amount" />
      </>,
    );
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
  });
  it('renders every role and tone without axe violations in both themes', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const { container, unmount } = render(
        <div>
          {roles.map((role) => (
            <Text key={role} variant={role}>
              {role}
            </Text>
          ))}
          {manifest.props.tone.values.map((tone) => (
            <Text key={tone} tone={tone as never}>
              {tone}
            </Text>
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
    const { variants, defaultVariants } = textVariantsConfig();
    expectManifestMatchesVariants(manifest, textVariants, { variants, defaultVariants });
  });
});

function textVariantsConfig() {
  return {
    variants: {
      variant: Object.fromEntries(manifest.props.variant.values.map((v) => [v, ''])),
      tone: Object.fromEntries(manifest.props.tone.values.map((v) => [v, ''])),
      align: { start: '', center: '', end: '' },
    },
    defaultVariants: { variant: 'body-md', tone: 'primary', align: 'start' },
  };
}
