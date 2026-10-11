import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const START = '/* macaw:start */';
const END = '/* macaw:end */';

/** Root stylesheets by framework convention: Next, Vite, React Router, generic. */
const CANDIDATES = [
  'src/app/globals.css',
  'app/globals.css',
  'src/styles/globals.css',
  'styles/globals.css',
  'src/index.css',
  'src/app.css',
  'app/app.css',
  'src/styles.css',
];

const TAILWIND_IMPORT = /^\s*@import\s+["']tailwindcss["'][^;]*;[^\n]*\n?/m;

export type RootCss = { path: string } | { reason: 'none' | 'multiple'; found: string[] };

export function findRootCss(cwd: string): RootCss {
  const found = CANDIDATES.filter((f) => existsSync(join(cwd, f)));
  if (found.length === 1) return { path: found[0]! };
  return { reason: found.length ? 'multiple' : 'none', found };
}

/** Major version from a package.json range such as "^4.1.0"; undefined when absent or not semver. */
export function tailwindMajor(pkg: {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}): number | undefined {
  const range = pkg.dependencies?.tailwindcss ?? pkg.devDependencies?.tailwindcss;
  const major = range?.match(/\d+/)?.[0];
  return major ? Number(major) : undefined;
}

/** Tailwind v3 projects use `@tailwind` directives; v4 imports `tailwindcss`. */
export function usesTailwindV3Directives(css: string): boolean {
  return /^\s*@tailwind\s+(base|components|utilities)/m.test(css);
}

/** create-next-app's starter globals.css, which overrides MACAW's colours and fonts. */
export function hasNextStarterStyles(css: string): boolean {
  return /--background:\s*#fff/i.test(css) || /font-family:\s*Arial,\s*Helvetica/.test(css);
}

/**
 * Puts the MACAW imports in a marked block right after the app's Tailwind import (keeping any
 * options on it), or at the top with the Tailwind import when there is none. Idempotent.
 */
export async function wireCss(
  file: string,
  scope: string,
): Promise<'created' | 'updated' | 'unchanged'> {
  const css = await readFile(file, 'utf8');
  const imports = [
    `@import "${scope}/tokens/tokens.css";`,
    `@import "${scope}/tokens/theme.css";`,
    `@import "${scope}/ui/styles.css";`,
  ];
  const marked = new RegExp(`${escape(START)}[\\s\\S]*?${escape(END)}\\n?`);
  const withoutBlock = css.replace(marked, '');
  const tw = withoutBlock.match(TAILWIND_IMPORT);

  let next: string;
  if (tw?.index !== undefined) {
    const at = tw.index + tw[0].length;
    const block = [START, ...imports, END].join('\n') + '\n';
    next =
      withoutBlock.slice(0, at) +
      (tw[0].endsWith('\n') ? '' : '\n') +
      block +
      withoutBlock.slice(at);
  } else {
    const block = [START, '@import "tailwindcss";', ...imports, END].join('\n') + '\n';
    const charset = withoutBlock.match(/^@charset[^;]*;\n?/);
    const head = charset?.[0] ?? '';
    const rest = withoutBlock.slice(head.length);
    next = head + block + (rest.trim() ? '\n' + rest.replace(/^\n+/, '') : '');
  }

  if (next === css) return 'unchanged';
  await writeFile(file, next);
  return marked.test(css) ? 'updated' : 'created';
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
