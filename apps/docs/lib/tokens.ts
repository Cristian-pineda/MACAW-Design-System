import { wcagContrast } from 'culori';
import tokensJson from '../../../registry/tokens.json';

export type TokenTier = 'primitive' | 'semantic' | 'component';

export interface TokenEntry {
  name: string;
  cssVar: string;
  path: string[];
  type: string;
  tier: TokenTier;
  original: unknown;
  value: { light: string | number; dark: string | number };
  themed: boolean;
  file: string;
  /** Value under data-density="compact", when it differs (DECISIONS.md #18). */
  compact?: string | number;
  description?: string;
}

const data = tokensJson as unknown as { version: string; prefix: string; tokens: TokenEntry[] };

export function getTokens(): TokenEntry[] {
  return data.tokens;
}

export function getTokensVersion(): string {
  return data.version;
}

const byName = new Map(data.tokens.map((t) => [t.name, t]));

export function getToken(name: string): TokenEntry | undefined {
  return byName.get(name);
}

export function tokensByPrefix(prefix: string, tier?: TokenTier): TokenEntry[] {
  return data.tokens.filter(
    (t) => t.name.startsWith(prefix) && (tier === undefined || t.tier === tier),
  );
}

/** Primitive colour ramps grouped by ramp name (neutral, accent, success, …), steps in source order. */
export function getColorRamps(): { ramp: string; steps: TokenEntry[] }[] {
  const ramps = new Map<string, TokenEntry[]>();
  for (const t of data.tokens) {
    if (t.tier !== 'primitive' || t.type !== 'color') continue;
    const ramp = t.path[1] ?? 'other';
    const list = ramps.get(ramp) ?? [];
    list.push(t);
    ramps.set(ramp, list);
  }
  return [...ramps.entries()].map(([ramp, steps]) => ({ ramp, steps }));
}

/** Semantic colour tokens grouped by their second path segment (surface, fg, line, action, status, field, focus, data). */
export function getSemanticColorGroups(): { group: string; tokens: TokenEntry[] }[] {
  const groups = new Map<string, TokenEntry[]>();
  for (const t of data.tokens) {
    if (t.tier !== 'semantic' || t.type !== 'color') continue;
    const group = t.path[1] ?? 'other';
    const list = groups.get(group) ?? [];
    list.push(t);
    groups.set(group, list);
  }
  return [...groups.entries()].map(([group, tokens]) => ({ group, tokens }));
}

/** WCAG 2.x contrast ratio between two CSS colour strings (oklch supported through culori). */
export function contrast(fg: string, bg: string): number {
  const ratio = wcagContrast(fg, bg);
  return Number.isFinite(ratio) ? Math.round(ratio * 100) / 100 : 0;
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}

export const TEXT_VARIANTS = [
  'display-lg',
  'display-md',
  'heading-lg',
  'heading-md',
  'heading-sm',
  'body-lg',
  'body-md',
  'body-sm',
  'label-md',
  'label-sm',
  'caption',
  'numeric-lg',
  'numeric-md',
  'numeric-sm',
  'code',
] as const;

export type TextVariant = (typeof TEXT_VARIANTS)[number];

export function getTypographyVariant(variant: TextVariant) {
  return {
    size: getToken(`text.size.${variant}`),
    leading: getToken(`text.leading.${variant}`),
    weight: getToken(`text.weight.${variant}`),
    tracking: getToken(`text.tracking.${variant}`),
  };
}

/** The background a semantic foreground token is meant to sit on, when that pairing is part of the contract. */
export function pairFor(name: string): string | null {
  if (name.startsWith('color.fg.'))
    return name.endsWith('inverse')
      ? 'color.surface.inverse'
      : name.endsWith('on-accent')
        ? 'color.action.primary'
        : 'color.surface.layer-1';
  const status = /^color\.status\.([a-z]+)-(solid-fg|fg)$/.exec(name);
  if (status)
    return status[2] === 'fg' ? `color.status.${status[1]}-bg` : `color.status.${status[1]}-solid`;
  const action = /^color\.action\.([a-z]+)-fg$/.exec(name);
  if (action)
    return action[1] === 'disabled' ? 'color.action.disabled' : `color.action.${action[1]}`;
  if (name === 'color.focus.ring') return 'color.surface.layer-1';
  if (name.startsWith('color.status.') && !name.slice('color.status.'.length).includes('-'))
    return 'color.surface.layer-1';
  if (name === 'color.field.line') return 'color.field.bg';
  if (name === 'color.line.strong') return 'color.surface.layer-1';
  return null;
}

/** Semantic colour groups in reading order. */
export const SEMANTIC_GROUP_ORDER = [
  'surface',
  'fg',
  'line',
  'action',
  'status',
  'field',
  'focus',
  'data',
] as const;

/** The surface ladder: depth by tone (DECISIONS.md #17). Hover tokens are listed with their layer. */
export const SURFACE_LAYERS = [
  {
    name: 'color.surface.canvas',
    utility: 'bg-surface-canvas',
    use: 'The app background and the main area behind every page.',
  },
  {
    name: 'color.surface.layer-1',
    utility: 'bg-surface-layer-1',
    hover: 'color.surface.layer-1-hover',
    use: 'TopBar, SideNav column, PageHeader, cards and panels.',
  },
  {
    name: 'color.surface.layer-2',
    utility: 'bg-surface-layer-2',
    hover: 'color.surface.layer-2-hover',
    use: 'Regions inside a layer-1 surface: table headers, card footers, code blocks, wells.',
  },
  {
    name: 'color.surface.layer-3',
    utility: 'bg-surface-layer-3',
    hover: 'color.surface.layer-3-hover',
    use: 'A region inside layer-2: a selected row in a well, a segmented track inside a footer.',
  },
  {
    name: 'color.surface.overlay',
    utility: 'bg-surface-overlay',
    use: 'Floating UI above the page: menus, popovers, dialogs. Pairs with a shadow.',
  },
  {
    name: 'color.surface.inverse',
    utility: 'bg-surface-inverse',
    use: 'Tooltips and toasts. Text on it is fg.inverse.',
  },
] as const;

/** The utility a layout or size token is consumed through, for the density tables. */
export function utilityFor(name: string): string {
  const map: Record<string, string> = {
    'size.control.sm': 'h-control-sm',
    'size.control.md': 'h-control-md',
    'size.control.lg': 'h-control-lg',
    'size.target.min': 'min-h-target-min',
    'size.topbar': 'h-topbar · top-topbar',
    'size.sidenav': 'w-sidenav',
    'layout.gutter': 'gap-gutter',
    'layout.margin': 'px-margin',
    'layout.section': 'py-section · gap-section',
    'layout.card-x': 'px-card-x (Card padding md)',
    'layout.card-y': 'py-card-y (Card padding md)',
    'layout.card-x-sm': 'px-card-x-sm (Card padding sm)',
    'layout.card-y-sm': 'py-card-y-sm (Card padding sm)',
    'layout.grid.columns': 'layout-grid',
    'layout.container.prose': 'max-w-prose',
    'layout.container.form': 'max-w-form',
    'layout.container.page': 'max-w-page',
    'layout.container.wide': 'max-w-wide',
  };
  if (map[name]) return map[name];
  const stack = /^layout\.stack-(\w+)$/.exec(name);
  if (stack) return `gap-stack-${stack[1]}`;
  const inline = /^layout\.inline-(\w+)$/.exec(name);
  if (inline) return `gap-inline-${inline[1]}`;
  return '—';
}
