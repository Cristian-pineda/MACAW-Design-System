import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import manifest from './icon.manifest.json';
import { Icon, iconNames } from './index.ts';

describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });
  it('exposes a name when labelled', async () => {
    const { container } = render(<Icon name="lock" label="Locked" />);
    expect(screen.getByRole('img', { name: 'Locked' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
  it('renders every curated icon without axe violations', async () => {
    const { container } = render(
      <div>
        {iconNames.map((n) => (
          <Icon key={n} name={n} />
        ))}
      </div>,
    );
    expect(container.querySelectorAll('svg')).toHaveLength(iconNames.length);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('keeps the manifest in step with the curated set', () => {
    expect(manifest.props.name.values).toEqual(iconNames);
  });
});
