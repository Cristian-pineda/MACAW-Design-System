import { describe, expect, it } from 'vitest';
import { buildJsxSnippet, inferControl, parseManifest, previewControls } from '../src/index.ts';

const base = {
  name: 'Button',
  slug: 'button',
  package: '@macaw-ds/ui',
  status: 'beta',
  since: '0.1.0',
  category: 'primitive',
  purpose: 'Triggers an action.',
  description: 'A button.',
  exports: ['Button'],
  props: {
    variant: {
      type: 'enum',
      values: ['primary', 'secondary'],
      default: 'primary',
      description: 'Visual weight',
    },
    loading: { type: 'boolean', default: false, description: 'Busy state' },
    children: { type: 'node', description: 'Label' },
  },
  tokens: ['color.action.primary'],
  a11y: {
    role: 'button',
    focusable: true,
    keyboard: ['Enter, Space: activate'],
    name: 'From children',
  },
  motion: { description: 'Spinner rotates', tokens: ['animation.spin'], whenProp: 'loading' },
  budget: { gzip: 3000 },
  rules: ['One primary button per view.'],
  donts: ['Do not use for navigation.'],
  examples: [{ name: 'Default', props: { children: 'Save' } }],
};

describe('ManifestSchema', () => {
  it('accepts a valid manifest and applies defaults', () => {
    const m = parseManifest(base);
    expect(m.slots).toEqual([]);
    expect(m.props.loading?.required).toBe(false);
  });
  it('rejects an enum without values', () => {
    expect(() =>
      parseManifest({ ...base, props: { size: { type: 'enum', description: 'x' } } }),
    ).toThrow(/values/);
  });
  it('rejects a default outside values', () => {
    expect(() =>
      parseManifest({
        ...base,
        props: { size: { type: 'enum', values: ['sm'], default: 'xl', description: 'x' } },
      }),
    ).toThrow(/default/);
  });
  it('rejects unknown keys', () => {
    expect(() => parseManifest({ ...base, extra: true })).toThrow(/Unrecognized/i);
  });
  it('requires the a11y block', () => {
    const { a11y: _a11y, ...rest } = base;
    expect(() => parseManifest(rest)).toThrow(/a11y/);
  });
});

describe('buildJsxSnippet', () => {
  const m = parseManifest(base);
  it('omits defaults and renders children', () => {
    expect(buildJsxSnippet(m, { variant: 'primary', loading: false, children: 'Save' })).toBe(
      "import { Button } from '@macaw-ds/ui';\n\n<Button>Save</Button>\n",
    );
  });
  it('renders non-default props', () => {
    expect(buildJsxSnippet(m, { variant: 'secondary', loading: true, children: 'Save' })).toContain(
      '<Button variant="secondary" loading>Save</Button>',
    );
  });
  it('self-closes without children', () => {
    expect(buildJsxSnippet(m, {})).toContain('<Button />');
  });
});

describe('inferControl', () => {
  it('picks segmented for small enums and select for large ones', () => {
    expect(
      inferControl({ type: 'enum', values: ['a', 'b'], description: 'x', required: false }),
    ).toBe('segmented');
    expect(
      inferControl({
        type: 'enum',
        values: ['a', 'b', 'c', 'd', 'e'],
        description: 'x',
        required: false,
      }),
    ).toBe('select');
  });
  it('honours an explicit control', () => {
    expect(
      inferControl({
        type: 'enum',
        values: ['a'],
        control: 'select',
        description: 'x',
        required: false,
      }),
    ).toBe('select');
  });
});

describe('previewControls', () => {
  const m = parseManifest(base);
  it('shows focus for focusable components and motion when declared', () => {
    expect(previewControls(m, {}).focus).toBe(true);
    expect(previewControls(m, {}).motion).toBe(true);
    expect(previewControls(m, {}).hints).toEqual(['Motion is visible when loading is on.']);
    expect(previewControls(m, { loading: true }).hints).toEqual([]);
  });
  it('hides both for static components and gates focus on a prop', () => {
    const { motion: _motion, ...staticBase } = base;
    const s = parseManifest({ ...staticBase, a11y: { ...base.a11y, focusable: false } });
    expect(previewControls(s, {})).toEqual({ focus: false, motion: false, hints: [] });
    const c = parseManifest({
      ...staticBase,
      a11y: { ...base.a11y, focusable: { whenProp: 'interactive' } },
    });
    expect(previewControls(c, {}).focus).toBe(false);
    expect(previewControls(c, { interactive: true }).focus).toBe(true);
  });
});
