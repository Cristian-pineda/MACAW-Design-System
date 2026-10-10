import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import globals from 'globals';
import noRawValues from './rules/no-raw-values.js';
import noClassnameOnMacaw from './rules/no-classname-on-macaw.js';

export const macawPlugin = {
  meta: { name: 'macaw', version: '0.0.0' },
  rules: {
    'no-raw-values': noRawValues,
    'no-classname-on-macaw': noClassnameOnMacaw,
  },
};

const ARBITRARY_COLOR =
  '^(?:[a-z0-9:-]+:)*(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|accent|caret|shadow|divide|placeholder)-\\[.*\\]$';
const ARBITRARY_LENGTH =
  '^(?:[a-z0-9:-]+:)*(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|inset|top|right|bottom|left|rounded(?:-[a-z]+)?|text|leading|tracking|border(?:-[a-z]+)?)-\\[.*\\]$';
const DEFAULT_PALETTE =
  '^(?:[a-z0-9:-]+:)*(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|accent|caret|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\\d+)?(?:/\\d+)?$';

/**
 * @param {object} [options]
 * @param {string} [options.tailwindEntry] Path to the CSS entry that imports the MACAW theme; enables unregistered-class checks.
 * @param {boolean} [options.system] True inside the MACAW monorepo. Consumers leave it false.
 * @param {string[]} [options.files] Globs to lint. Defaults to TS/JS/JSX.
 */
export default function macaw(options = {}) {
  const { tailwindEntry, system = false, files = ['**/*.{ts,tsx,js,jsx,mjs,cjs}'] } = options;

  // Tailwind-aware rules need Tailwind resolvable from the linted package, so they are on only
  // when a stylesheet entry is given (packages/ui, apps/docs, consumer apps).
  const tailwindRules = !tailwindEntry
    ? {}
    : {
        'better-tailwindcss/no-duplicate-classes': 'error',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-restricted-classes': [
          'error',
          {
            restrict: [
              {
                pattern: ARBITRARY_COLOR,
                message:
                  'Arbitrary colour values are not allowed. Use a token utility such as bg-action-primary.',
              },
              {
                pattern: ARBITRARY_LENGTH,
                message:
                  'Arbitrary lengths are not allowed. Use the 4px scale (p-4) or a token utility.',
              },
              {
                pattern: DEFAULT_PALETTE,
                message:
                  "Tailwind's default palette is disabled in MACAW. Use a semantic token utility.",
              },
            ],
          },
        ],
        'better-tailwindcss/no-unknown-classes': [
          'error',
          { ignore: ['^macaw-', '^group(?:/.*)?$', '^peer(?:/.*)?$'] },
        ],
      };

  return [
    {
      files,
      ...js.configs.recommended,
    },
    ...tseslint.configs.recommended.map((c) => ({ files, ...c })),
    {
      files,
      ...reactHooks.configs.flat.recommended,
    },
    {
      files,
      ...jsxA11y.flatConfigs.strict,
    },
    {
      files,
      plugins: { 'better-tailwindcss': betterTailwind, macaw: macawPlugin },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: { ...globals.browser, ...globals.node, ...globals.es2024 },
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      settings: {
        'better-tailwindcss': {
          ...(tailwindEntry ? { entryPoint: tailwindEntry } : {}),
          callees: ['cva', 'cn', 'cx', 'clsx', 'tv'],
          attributes: ['className', 'class'],
        },
      },
      rules: {
        ...tailwindRules,
        'macaw/no-raw-values': 'error',
        'macaw/no-classname-on-macaw': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { fixStyle: 'inline-type-imports' },
        ],
        ...(system ? {} : { 'react-hooks/exhaustive-deps': 'warn' }),
      },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}', '**/test/**', '**/e2e/**'],
      rules: { 'macaw/no-raw-values': 'off', 'better-tailwindcss/no-unknown-classes': 'off' },
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
  ];
}
