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
      else if (root === 'duration')
        utilities.push(`@utility duration-${key} {\n  transition-duration: ${v};\n}`);
      else if (root === 'z') utilities.push(`@utility z-${key} {\n  z-index: ${v};\n}`);
      else if (root === 'size' && rest[0] === 'control') {
        utilities.push(`@utility h-control-${rest[1]} {\n  height: ${v};\n}`);
        utilities.push(`@utility min-h-control-${rest[1]} {\n  min-height: ${v};\n}`);
      } else if (root === 'focus' && rest[0] === 'ring' && rest[1] === 'width') {
        utilities.push(`@utility outline-focus {\n  outline-width: ${v};\n}`);
      } else if (root === 'focus' && rest[0] === 'ring' && rest[1] === 'offset') {
        utilities.push(`@utility outline-offset-focus {\n  outline-offset: ${v};\n}`);
      } else if (root === 'shape') {
        utilities.push(`@utility rounded-${key} {\n  border-radius: ${v};\n}`);
      }
    }

    // Only utilities.css is imported by @macaw-ds/ui, so the keyframes Tailwind's own theme would
    // provide must live here. One animation: the loading spinner.
    theme.push('  --animate-spin: spin 1s linear infinite;');
    theme.push('  @keyframes spin {\n    to {\n      transform: rotate(360deg);\n    }\n  }');
    utilities.push(`@utility tabular-nums {\n  font-variant-numeric: tabular-nums;\n}`);

    return `${header()}@theme inline {\n${theme.join('\n')}\n}\n\n${utilities.join('\n\n')}\n`;
  },
};
