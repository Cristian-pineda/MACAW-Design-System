import type { Format } from 'style-dictionary/types';
import { header, tierOf } from './shared.ts';

/**
 * Emits a Tailwind v4 `@theme inline` block that maps namespaces to the runtime variables,
 * plus `@utility` blocks for namespaces Tailwind does not have (duration, z-index).
 * Default Tailwind colours, radii, shadows, fonts and font sizes are disabled with `initial`
 * so the only utilities that exist are token utilities.
 */
export const tailwindTheme: Format = {
  name: 'macaw/tailwind-theme',
  format: ({ dictionary }) => {
    const theme: string[] = [
      '  --color-*: initial;',
      '  --radius-*: initial;',
      '  --shadow-*: initial;',
      '  --text-*: initial;',
      '  --font-*: initial;',
      '  --font-weight-*: initial;',
      '  --tracking-*: initial;',
      '  --ease-*: initial;',
      '  --breakpoint-*: initial;',
      '  --animate-*: initial;',
      '  --container-*: initial;',
      '  --spacing: 0.25rem;',
    ];
    const utilities: string[] = [];

    for (const t of dictionary.allTokens) {
      const tier = tierOf(t);
      const v = `var(--${t.name})`;
      const [root, ...rest] = t.path;
      const key = rest.join('-');

      if (root === 'color' && tier === 'semantic') theme.push(`  --color-${key}: ${v};`);
      else if (root === 'radius' && tier === 'primitive') theme.push(`  --radius-${key}: ${v};`);
      else if (root === 'shadow' && tier === 'primitive') theme.push(`  --shadow-${key}: ${v};`);
      else if (root === 'elevation') theme.push(`  --shadow-${key}: ${v};`);
      else if (root === 'font' && rest[0] === 'family') theme.push(`  --font-${rest[1]}: ${v};`);
      else if (root === 'font' && rest[0] === 'weight')
        theme.push(`  --font-weight-${rest[1]}: ${v};`);
      else if (root === 'font' && rest[0] === 'tracking')
        theme.push(`  --tracking-${rest[1]}: ${v};`);
      else if (root === 'text' && rest[0] === 'size') theme.push(`  --text-${rest[1]}: ${v};`);
      else if (root === 'text' && rest[0] === 'leading')
        theme.push(`  --text-${rest[1]}--line-height: ${v};`);
      else if (root === 'text' && rest[0] === 'weight')
        theme.push(`  --text-${rest[1]}--font-weight: ${v};`);
      else if (root === 'text' && rest[0] === 'tracking')
        theme.push(`  --text-${rest[1]}--letter-spacing: ${v};`);
      else if (root === 'ease') theme.push(`  --ease-${key}: ${v};`);
      // Breakpoints feed media queries, which cannot read var(); emit the literal value.
      else if (root === 'breakpoint')
        theme.push(`  --breakpoint-${key}: ${String(t.$value ?? t.value)};`);
      // Layout rhythm and chrome sizes become named spacing values, so every spacing utility
      // gets them (gap-gutter, px-margin, p-card-x, h-topbar, top-topbar, h-control-md).
      else if (root === 'layout' && rest[0] === 'container')
        theme.push(`  --container-${rest[1]}: ${v};`);
      else if (root === 'layout' && rest[0] === 'grid') {
        utilities.push(
          `@utility layout-grid {\n  display: grid;\n  grid-template-columns: repeat(${v}, minmax(0, 1fr));\n  column-gap: var(--macaw-layout-gutter);\n}`,
        );
      } else if (root === 'layout') theme.push(`  --spacing-${key}: ${v};`);
      else if (root === 'size' && rest[0] === 'control')
        theme.push(`  --spacing-control-${rest[1]}: ${v};`);
      else if (root === 'size' && (rest[0] === 'topbar' || rest[0] === 'sidenav'))
        theme.push(`  --spacing-${rest[0]}: ${v};`);
      else if (root === 'size' && rest[0] === 'target') theme.push(`  --spacing-target-min: ${v};`);
      else if (root === 'animation') theme.push(`  --animate-${key}: ${v};`);
      else if (root === 'duration')
        utilities.push(`@utility duration-${key} {\n  transition-duration: ${v};\n}`);
      else if (root === 'z') utilities.push(`@utility z-${key} {\n  z-index: ${v};\n}`);
      else if (root === 'focus' && rest[0] === 'ring' && rest[1] === 'width') {
        utilities.push(`@utility outline-focus {\n  outline-width: ${v};\n}`);
      } else if (root === 'focus' && rest[0] === 'ring' && rest[1] === 'offset') {
        utilities.push(`@utility outline-offset-focus {\n  outline-offset: ${v};\n}`);
      } else if (root === 'shape') {
        utilities.push(`@utility rounded-${key} {\n  border-radius: ${v};\n}`);
      }
    }

    // Only utilities.css is imported by @macaw-ds/ui, so the keyframes Tailwind's own theme would
    // provide must live here. One animation: the loading spinner.
    theme.push('  @keyframes spin {\n    to {\n      transform: rotate(360deg);\n    }\n  }');
    utilities.push(
      `@utility h-below-topbar {\n  height: calc(100dvh - var(--macaw-size-topbar));\n}`,
    );
    utilities.push(`@utility tabular-nums {\n  font-variant-numeric: tabular-nums;\n}`);

    // force-focus: renders an element's own focus-visible style without focus, for previews,
    // screenshots and visual tests. Scope with data-force-focus on the element or an ancestor.
    const variants =
      '@custom-variant force-focus (&:where([data-force-focus], [data-force-focus] *));\n\n';
    return `${header()}${variants}@theme inline {\n${theme.join('\n')}\n}\n\n${utilities.join('\n\n')}\n`;
  },
};
