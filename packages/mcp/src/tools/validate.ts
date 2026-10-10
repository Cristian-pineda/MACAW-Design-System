import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import macaw from '@macaw-ds/eslint-config';
import { loadIndex } from '../registry.ts';

/** Components people reach for that MACAW does not have yet. Reported as not-in-system. */
const MISSING = new Set([
  'Table',
  'DataTable',
  'Select',
  'Dialog',
  'Modal',
  'Tooltip',
  'Popover',
  'Tabs',
  'Tab',
  'Toast',
  'DatePicker',
  'Calendar',
  'Checkbox',
  'Radio',
  'RadioGroup',
  'Switch',
  'Toggle',
  'Textarea',
  'TextArea',
  'DropdownMenu',
  'Menu',
  'Combobox',
  'NumberField',
  'Slider',
  'Progress',
  'Avatar',
  'Breadcrumb',
  'Pagination',
  'Sheet',
  'Drawer',
  'Skeleton',
  'Alert',
  'Accordion',
  'CommandPalette',
  'Command',
  'AppShell',
  'Sidebar',
]);

let eslint: ESLint | undefined;
function linter(): ESLint {
  if (eslint) return eslint;
  const here = dirname(fileURLToPath(import.meta.url));
  const tailwindEntry = join(here, '..', 'styles', 'entry.css');
  eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      ...macaw({ tailwindEntry, files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'] }),
      {
        files: ['**/*'],
        rules: {
          '@typescript-eslint/no-unused-vars': 'off',
          'no-undef': 'off',
          'no-unused-vars': 'off',
        },
      },
    ],
    cwd: join(here, '..'),
  });
  return eslint;
}

export interface ValidateResult {
  ok: boolean;
  messages: Array<{
    line: number;
    column: number;
    rule: string | null;
    severity: 'error' | 'warning';
    message: string;
  }>;
  notInSystem: string[];
  unknownComponents: string[];
  macawComponents: string[];
}

export async function validate(code: string, filename = 'snippet.tsx'): Promise<ValidateResult> {
  const index = await loadIndex();
  const known = new Set<string>();
  for (const item of index.items) for (const e of item.meta?.macaw?.exports ?? []) known.add(e);

  const used = new Set<string>();
  for (const m of code.matchAll(/<([A-Z][A-Za-z0-9]*)(?:\.[A-Za-z0-9]+)*[\s/>]/g))
    if (m[1]) used.add(m[1]);
  const macawComponents = [...used].filter((n) => known.has(n));
  const notInSystem = [...used].filter((n) => MISSING.has(n));
  const unknownComponents = [...used].filter((n) => !known.has(n) && !MISSING.has(n));

  const results = await linter().lintText(code, { filePath: filename });
  const messages = results.flatMap((r) =>
    r.messages.map((m) => ({
      line: m.line,
      column: m.column,
      rule: m.ruleId,
      severity: m.severity === 2 ? ('error' as const) : ('warning' as const),
      message: m.message,
    })),
  );
  const fatal = results.some((r) => r.messages.some((m) => m.fatal));
  const ok = !fatal && messages.every((m) => m.severity !== 'error') && notInSystem.length === 0;
  return { ok, messages, notInSystem, unknownComponents, macawComponents };
}
