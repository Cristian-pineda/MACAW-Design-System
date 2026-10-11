/**
 * Builds @macaw-ds/tokens from the DTCG sources in src/.
 * Two layered builds: light (primitive + semantic + component) and dark (semantic overrides only).
 * Outputs: dist/tokens.css, dist/theme.css, dist/tokens.js, dist/tokens.d.ts, dist/tokens.meta.json
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { cssVariablesThemed } from './formats/css-variables-themed.ts';
import { tailwindTheme } from './formats/tailwind-theme.ts';
import { metaJson, type TokenMeta } from './formats/meta-json.ts';
import { header, PREFIX } from './formats/shared.ts';

const DIST = 'dist/';
const PRIMITIVE = ['src/primitive/**/*.json'];
const SEMANTIC_BASE = ['src/semantic/!(*.dark|*.compact).json'];
const SEMANTIC_DARK = ['src/semantic/*.dark.json'];
const DENSITY_COMPACT = ['src/semantic/*.compact.json'];
const COMPONENT = ['src/component/**/*.json'];

StyleDictionary.registerFormat(cssVariablesThemed);
StyleDictionary.registerFormat(tailwindTheme);
StyleDictionary.registerFormat(metaJson);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const light = new StyleDictionary({
  usesDtcg: true,
  log: { verbosity: 'silent', warnings: 'error' },
  include: PRIMITIVE,
  source: [...SEMANTIC_BASE, ...COMPONENT],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: DIST,
      files: [
        {
          destination: 'tokens.light.css',
          format: 'macaw/css-themed',
          options: { selector: ':root' },
        },
        { destination: 'theme.css', format: 'macaw/tailwind-theme' },
        { destination: 'tokens.meta.light.json', format: 'macaw/meta' },
      ],
    },
  },
});

const dark = new StyleDictionary({
  usesDtcg: true,
  log: { verbosity: 'silent', warnings: 'error' },
  include: [...PRIMITIVE, ...SEMANTIC_BASE, ...COMPONENT],
  source: SEMANTIC_DARK,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: DIST,
      files: [
        {
          destination: 'tokens.dark.css',
          format: 'macaw/css-themed',
          filter: (t) => String(t.filePath).endsWith('.dark.json'),
          options: { selector: '[data-theme="dark"]', withHeader: false },
        },
        {
          destination: 'tokens.dark.media.css',
          format: 'macaw/css-themed',
          filter: (t) => String(t.filePath).endsWith('.dark.json'),
          options: { selector: '  :root:not([data-theme="light"])', withHeader: false },
        },
        { destination: 'tokens.meta.dark.json', format: 'macaw/meta' },
      ],
    },
  },
});

const compact = new StyleDictionary({
  usesDtcg: true,
  log: { verbosity: 'silent', warnings: 'error' },
  include: [...PRIMITIVE, ...SEMANTIC_BASE, ...COMPONENT],
  source: DENSITY_COMPACT,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: PREFIX,
      buildPath: DIST,
      files: [
        {
          destination: 'tokens.compact.css',
          format: 'macaw/css-themed',
          filter: (t) => String(t.filePath).endsWith('.compact.json'),
          options: { selector: '[data-density="compact"]', withHeader: false },
        },
        { destination: 'tokens.meta.compact.json', format: 'macaw/meta' },
      ],
    },
  },
});

await light.buildAllPlatforms();
await dark.buildAllPlatforms();
await compact.buildAllPlatforms();

// ---- Assemble tokens.css --------------------------------------------------------------------
const lightCss = await readFile(`${DIST}tokens.light.css`, 'utf8');
const darkCss = await readFile(`${DIST}tokens.dark.css`, 'utf8');
const darkMedia = await readFile(`${DIST}tokens.dark.media.css`, 'utf8');
const compactCss = await readFile(`${DIST}tokens.compact.css`, 'utf8');

const reducedMotion = `
    --${PREFIX}-duration-fast: 0ms;
    --${PREFIX}-duration-base: 0ms;
    --${PREFIX}-duration-slow: 0ms;
    --${PREFIX}-duration-spin: 0ms;
    --${PREFIX}-animation-spin: none;`;

const extras = `
/*
 * Sticky chrome offsets (WCAG 2.2 SC 2.4.11 Focus Not Obscured). When an AppShell is on the page
 * at desktop widths, focused elements scroll clear of the sticky TopBar and PageHeader tab row.
 */
@media (width >= 64rem) {
  :root:has([data-macaw-app-shell]) {
    scroll-padding-top: calc(var(--${PREFIX}-size-topbar) + var(--${PREFIX}-space-4));
  }
  :root:has([data-macaw-app-shell] [data-page-header-tabs]) {
    scroll-padding-top: calc(var(--${PREFIX}-size-topbar) + var(--${PREFIX}-size-control-lg) + var(--${PREFIX}-space-4));
  }
}

/*
 * Keyframes for the animation tokens. Plain CSS on purpose: Tailwind drops keyframes declared
 * inside @theme unless a theme variable names them literally, and ours point at token variables.
 */
@keyframes ${PREFIX}-spin {
  to {
    transform: rotate(360deg);
  }
}

/*
 * Reduced motion. One mechanism for both the OS preference and an explicit scope:
 * data-motion="reduced" on any element (a user setting, a preview frame), or the OS setting
 * unless a scope opts back in with data-motion="full". Components only animate through these
 * tokens, so they never branch on motion themselves.
 */
@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) {${reducedMotion}
  }
}
[data-motion="reduced"] {${reducedMotion}
}

/* Forced colors (Windows High Contrast): keep structure and focus visible with system colours. */
@media (forced-colors: active) {
  :root, [data-theme="dark"] {
    --${PREFIX}-color-surface-canvas: Canvas;
    --${PREFIX}-color-surface-layer-1: Canvas;
    --${PREFIX}-color-surface-layer-2: Canvas;
    --${PREFIX}-color-surface-layer-3: Canvas;
    --${PREFIX}-color-surface-overlay: Canvas;
    --${PREFIX}-color-fg-primary: CanvasText;
    --${PREFIX}-color-fg-secondary: CanvasText;
    --${PREFIX}-color-fg-muted: GrayText;
    --${PREFIX}-color-fg-placeholder: GrayText;
    --${PREFIX}-color-fg-disabled: GrayText;
    --${PREFIX}-color-fg-numeric: CanvasText;
    --${PREFIX}-color-fg-link: LinkText;
    --${PREFIX}-color-line-subtle: CanvasText;
    --${PREFIX}-color-line-default: CanvasText;
    --${PREFIX}-color-line-strong: CanvasText;
    --${PREFIX}-color-action-primary: ButtonFace;
    --${PREFIX}-color-action-primary-fg: ButtonText;
    --${PREFIX}-color-field-bg: Field;
    --${PREFIX}-color-field-line: FieldText;
    --${PREFIX}-color-focus-ring: Highlight;
  }
}
`;

/** A comfortable block so a comfortable region can nest inside a compact page. */
function comfortableScope(compact: string, base: string): string {
  const names = [...compact.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map((m) => m[1]);
  const lines = names
    .map((name) => base.match(new RegExp(`^\\s+${name}: ([^;]+);`, 'm')))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => `  ${m[0].trim()}`);
  return `[data-density="comfortable"] {\n${lines.join('\n')}\n}\n`;
}

// An explicit light block so a light scope nested inside a dark page (a preview frame, a swatch)
// re-applies the light values. Only themed tokens need to appear here.
const darkNames = [...darkCss.matchAll(/^\s+(--[a-z0-9-]+):/gm)].map((m) => m[1]);
const lightLines = darkNames
  .map((name) => lightCss.match(new RegExp(`^\\s+${name}: ([^;]+);`, 'm')))
  .filter((m): m is RegExpMatchArray => m !== null)
  .map((m) => `  ${m[0].trim()}`);
const lightScope = `[data-theme="light"] {\n${lightLines.join('\n')}\n}\n`;

await writeFile(
  `${DIST}tokens.css`,
  `${lightCss}\n${lightScope}\n${darkCss}\n@media (prefers-color-scheme: dark) {\n${darkMedia.replace(/^/gm, '  ').replace(/^\s+$/gm, '')}}\n\n/* Density: compact overrides control heights, chrome and layout spacing on any scope. */\n${compactCss}${comfortableScope(compactCss, lightCss)}${extras}`,
);
await Promise.all(
  ['tokens.light.css', 'tokens.dark.css', 'tokens.dark.media.css', 'tokens.compact.css'].map((f) =>
    rm(`${DIST}${f}`),
  ),
);

// ---- Merge metadata ------------------------------------------------------------------------
const lightMeta = JSON.parse(
  await readFile(`${DIST}tokens.meta.light.json`, 'utf8'),
) as TokenMeta[];
const darkMeta = JSON.parse(await readFile(`${DIST}tokens.meta.dark.json`, 'utf8')) as TokenMeta[];
const darkByName = new Map(darkMeta.map((t) => [t.name, t]));
const compactMeta = JSON.parse(
  await readFile(`${DIST}tokens.meta.compact.json`, 'utf8'),
) as TokenMeta[];
const compactByName = new Map(compactMeta.map((t) => [t.name, t]));

const merged = lightMeta.map((t) => {
  const d = darkByName.get(t.name);
  const differs = d !== undefined && JSON.stringify(d.value) !== JSON.stringify(t.value);
  return {
    name: t.name,
    cssVar: t.cssVar,
    path: t.path,
    type: t.type,
    tier: t.tier,
    description: t.description,
    original: t.original,
    value: { light: t.value, dark: differs ? d.value : t.value },
    themed: differs,
    ...(() => {
      const c = compactByName.get(t.name);
      return c && JSON.stringify(c.value) !== JSON.stringify(t.value) ? { compact: c.value } : {};
    })(),
    file: t.file,
  };
});
await writeFile(
  `${DIST}tokens.meta.json`,
  JSON.stringify(
    { prefix: PREFIX, generatedFrom: 'packages/tokens/src', tokens: merged },
    null,
    2,
  ) + '\n',
);
await Promise.all(
  ['tokens.meta.light.json', 'tokens.meta.dark.json', 'tokens.meta.compact.json'].map((f) =>
    rm(`${DIST}${f}`),
  ),
);

// ---- TypeScript constants ------------------------------------------------------------------
type Tree = { [k: string]: Tree | string };
const tree: Tree = {};
for (const t of merged) {
  let node = tree;
  t.path.forEach((seg, i) => {
    if (i === t.path.length - 1) node[seg] = `var(${t.cssVar})`;
    else node = (node[seg] ??= {}) as Tree;
  });
}
const names = merged.map((t) => t.name);
const js = `${header().replace('/*', '//').replace('*/', '')}
export const tokens = ${JSON.stringify(tree, null, 2)};
export const tokenValues = ${JSON.stringify(
  Object.fromEntries(merged.map((t) => [t.name, t.value])),
  null,
  2,
)};
export const tokenNames = ${JSON.stringify(names)};
export function cssVar(name) {
  return \`var(--${PREFIX}-\${String(name).replace(/\\./g, '-')})\`;
}
`;
const dts = `${header().replace('/*', '//').replace('*/', '')}
export type TokenName = ${names.map((n) => JSON.stringify(n)).join(' | ')};
export type TokenValue = { light: unknown; dark: unknown };
export declare const tokens: ${JSON.stringify(tree, null, 2).replace(/"var\(--[^"]+\)"/g, 'string')};
export declare const tokenValues: Record<TokenName, TokenValue>;
export declare const tokenNames: readonly TokenName[];
/** Returns \`var(--${PREFIX}-…)\` for a token name such as "color.action.primary". */
export declare function cssVar(name: TokenName): string;
`;
await writeFile(`${DIST}tokens.js`, js);
await writeFile(`${DIST}tokens.d.ts`, dts);

console.log(
  `@macaw-ds/tokens: built ${merged.length} tokens (${merged.filter((t) => t.themed).length} themed) → dist/`,
);
