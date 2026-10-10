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
