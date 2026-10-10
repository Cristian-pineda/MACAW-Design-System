/**
 * The accessibility gates for the token layer (DECISIONS.md #8), executable.
 * Runs against dist/tokens.meta.json, so `pnpm build` must run first (turbo wires it).
 */
import { readFileSync } from 'node:fs';
import { clampChroma, parse, wcagContrast } from 'culori';
import { describe, expect, it } from 'vitest';

interface Meta {
  name: string;
  cssVar: string;
  type: string;
  tier: string;
  value: { light: unknown; dark: unknown };
}
const meta = JSON.parse(
  readFileSync(new URL('../dist/tokens.meta.json', import.meta.url), 'utf8'),
) as { tokens: Meta[] };
const byName = new Map(meta.tokens.map((t) => [t.name, t]));
const themes = ['light', 'dark'] as const;
type Theme = (typeof themes)[number];

function color(name: string, theme: Theme) {
  const t = byName.get(name);
  if (!t) throw new Error(`unknown token ${name}`);
  const parsed = parse(String(t.value[theme]));
  if (!parsed) throw new Error(`unparseable colour ${name} = ${String(t.value[theme])}`);
  return clampChroma(parsed, 'oklch');
}
function contrast(fg: string, bg: string, theme: Theme): number {
  return wcagContrast(color(fg, theme), color(bg, theme));
}
function expectContrast(fg: string, bg: string, min: number) {
  for (const theme of themes) {
    const ratio = contrast(fg, bg, theme);
    expect(
      ratio,
      `${theme}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1, need ${min}:1`,
    ).toBeGreaterThanOrEqual(min);
  }
}

const SURFACES = [
  'color.surface.canvas',
  'color.surface.layer-1',
  'color.surface.layer-1-hover',
  'color.surface.layer-2',
  'color.surface.layer-2-hover',
  'color.surface.layer-3',
  'color.surface.layer-3-hover',
  'color.surface.overlay',
];
const STATUS = ['neutral', 'success', 'warning', 'critical', 'info', 'accent'];

describe('text contrast (WCAG 2.2 1.4.3 AA, 1.4.6 AAA where named)', () => {
  it('primary text and numerals reach 7:1 on every surface', () => {
    for (const s of SURFACES) {
      expectContrast('color.fg.primary', s, 7);
      expectContrast('color.fg.numeric', s, 7);
    }
  });
  it('secondary, muted and placeholder text reach 4.5:1 on every surface', () => {
    for (const s of SURFACES) {
      expectContrast('color.fg.secondary', s, 4.5);
      expectContrast('color.fg.muted', s, 4.5);
    }
  });
  it('links reach 4.5:1 on the default surface', () => {
    expectContrast('color.fg.link', 'color.surface.layer-1', 4.5);
    expectContrast('color.fg.link-hover', 'color.surface.layer-1', 4.5);
  });
  it('button labels reach 4.5:1 in every state', () => {
    for (const state of ['', '-hover', '-active']) {
      expectContrast('color.action.primary-fg', `color.action.primary${state}`, 4.5);
      expectContrast('color.action.secondary-fg', `color.action.secondary${state}`, 4.5);
      expectContrast('color.action.destructive-fg', `color.action.destructive${state}`, 4.5);
    }
    expectContrast('color.fg.primary', 'color.action.ghost-hover', 4.5);
    expectContrast('color.action.disabled-fg', 'color.action.disabled', 3);
  });
  it('status text reaches 4.5:1 on soft and solid backgrounds', () => {
    for (const s of STATUS) {
      expectContrast(`color.status.${s}-fg`, `color.status.${s}-bg`, 4.5);
      expectContrast(`color.status.${s}-solid-fg`, `color.status.${s}-solid`, 4.5);
    }
  });
  it('field text and placeholder reach 4.5:1 on the field background', () => {
    expectContrast('color.fg.primary', 'color.field.bg', 4.5);
    expectContrast('color.fg.placeholder', 'color.field.bg', 4.5);
  });
});

describe('non-text contrast (WCAG 2.2 1.4.11 AA)', () => {
  it('form field boundaries reach 3:1', () => {
    expectContrast('color.field.line', 'color.field.bg', 3);
    expectContrast('color.field.line-hover', 'color.field.bg', 3);
    expectContrast('color.field.line-invalid', 'color.field.bg', 3);
    expectContrast('color.action.secondary-line', 'color.action.secondary', 3);
  });
  it('the focus ring reaches 3:1 against the field background', () => {
    expectContrast('color.focus.ring', 'color.field.bg', 3);
  });
  it('strong lines reach 3:1 on every resting layer', () => {
    for (const s of [
      'color.surface.canvas',
      'color.surface.layer-1',
      'color.surface.layer-2',
      'color.surface.layer-3',
      'color.surface.overlay',
    ]) {
      expectContrast('color.line.strong', s, 3);
    }
  });
  it('status icons and the data palette reach 3:1 on the default surface', () => {
    for (const s of STATUS) expectContrast(`color.status.${s}`, 'color.surface.layer-1', 3);
    for (const i of [1, 2, 3, 4, 5, 6])
      expectContrast(`color.data.${i}`, 'color.surface.layer-1', 3);
    expectContrast('color.data.positive', 'color.surface.layer-1', 3);
    expectContrast('color.data.negative', 'color.surface.layer-1', 3);
  });
});

describe('surface layers (depth by tone)', () => {
  const ladder = [
    'color.surface.canvas',
    'color.surface.layer-1',
    'color.surface.layer-2',
    'color.surface.layer-3',
  ];
  it('every adjacent layer differs visibly in tone in both themes', () => {
    for (const theme of themes) {
      for (let i = 0; i < ladder.length - 1; i++) {
        const a = color(ladder[i]!, theme);
        const b = color(ladder[i + 1]!, theme);
        const delta = Math.abs((a as { l: number }).l - (b as { l: number }).l);
        expect(
          delta,
          `${theme}: ${ladder[i]} vs ${ladder[i + 1]} lightness delta ${delta.toFixed(3)}`,
        ).toBeGreaterThanOrEqual(0.015);
      }
    }
  });
  it('the focus ring stays visible on every layer, including hover states', () => {
    for (const s of SURFACES) expectContrast('color.focus.ring', s, 3);
  });
});

describe('density and motion modes', () => {
  const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
  const block = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    return start < 0 ? '' : css.slice(start, css.indexOf('}', start));
  };
  it('compact controls stay at or above the 24px target size', () => {
    const compact = block('[data-density="compact"]');
    for (const size of ['sm', 'md', 'lg']) {
      const m = compact.match(new RegExp(`--macaw-size-control-${size}: (\\d+)px`));
      expect(m, `compact size.control.${size}`).not.toBeNull();
      expect(Number(m![1])).toBeGreaterThanOrEqual(24);
    }
  });
  it('comfortable re-applies every compact override so regions can nest', () => {
    const names = (b: string) => [...b.matchAll(/(--macaw-[a-z0-9-]+):/g)].map((m) => m[1]).sort();
    expect(names(block('[data-density="comfortable"]'))).toEqual(
      names(block('[data-density="compact"]')),
    );
  });
  it('reduced motion zeroes every duration and disables every animation', () => {
    const reduced = block('[data-motion="reduced"]');
    const durations = meta.tokens.filter(
      (t) => t.name.startsWith('duration.') && t.name !== 'duration.instant',
    );
    const animations = meta.tokens.filter((t) => t.name.startsWith('animation.'));
    expect(animations.length).toBeGreaterThan(0);
    for (const t of durations) expect(reduced, t.name).toContain(`${t.cssVar}: 0ms`);
    for (const t of animations) expect(reduced, t.name).toContain(`${t.cssVar}: none`);
  });
});

describe('output integrity', () => {
  const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
  const theme = readFileSync(new URL('../dist/theme.css', import.meta.url), 'utf8');
  it('has no unresolved references', () => {
    expect(css).not.toMatch(/\{[a-z]+\.[a-z0-9.-]+\}/);
  });
  it('every var() reference points at a defined variable', () => {
    const defined = new Set([...css.matchAll(/^\s*(--macaw-[a-z0-9-]+):/gm)].map((m) => m[1]));
    const referenced = new Set(
      [...`${css}\n${theme}`.matchAll(/var\((--macaw-[a-z0-9-]+)\)/g)].map((m) => m[1]),
    );
    const missing = [...referenced].filter((v) => !defined.has(v));
    expect(missing).toEqual([]);
  });
  it('exposes no primitive colour ramps as Tailwind utilities', () => {
    expect(theme).not.toMatch(/--color-(neutral|accent|success|warning|critical|info)-\d+:/);
  });
  it('keeps targets at or above 24px (WCAG 2.2 2.5.8)', () => {
    for (const size of ['sm', 'md', 'lg']) {
      const px = parseFloat(String(byName.get(`size.control.${size}`)?.value.light));
      expect(px).toBeGreaterThanOrEqual(24);
    }
  });
  it('themes only semantic tokens', () => {
    const themedPrimitives = meta.tokens.filter(
      (t) =>
        t.tier === 'primitive' && JSON.stringify(t.value.light) !== JSON.stringify(t.value.dark),
    );
    expect(themedPrimitives.map((t) => t.name)).toEqual([]);
  });
});
