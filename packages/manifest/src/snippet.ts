import type { Manifest } from './schema.ts';

export interface SnippetOptions {
  /** Component export to render; defaults to the first export. */
  component?: string;
  /** Children text for node-typed `children`. */
  children?: string;
  /** Include props whose value equals the manifest default. */
  includeDefaults?: boolean;
  /** Import path printed above the JSX. */
  importFrom?: string;
}

function formatValue(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (value === true) return '';
  if (value === false) return '{false}';
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'string') return `"${value.replace(/"/g, '&quot;')}"`;
  return `{${JSON.stringify(value)}}`;
}

/**
 * Builds the JSX a consumer would write for the given prop values.
 * Props equal to their manifest default are omitted so the snippet stays minimal.
 */
export function buildJsxSnippet(
  manifest: Manifest,
  props: Record<string, unknown>,
  options: SnippetOptions = {},
): string {
  const name = options.component ?? manifest.exports[0] ?? manifest.name;
  const importFrom = options.importFrom ?? manifest.package;
  const attrs: string[] = [];
  let children = options.children;

  for (const [key, spec] of Object.entries(manifest.props)) {
    const value = props[key];
    if (key === 'children') {
      if (typeof value === 'string') children = value;
      continue;
    }
    if (spec.type === 'function' || spec.type === 'node') continue;
    if (value === undefined) continue;
    if (!options.includeDefaults && spec.default !== undefined && value === spec.default) continue;
    if (!options.includeDefaults && spec.default === undefined && value === false) continue;
    const formatted = formatValue(value);
    if (formatted === null) continue;
    attrs.push(formatted === '' ? key : `${key}=${formatted}`);
  }

  const attrText = attrs.length ? ` ${attrs.join(' ')}` : '';
  const jsx =
    children !== undefined && children !== ''
      ? `<${name}${attrText}>${children}</${name}>`
      : `<${name}${attrText} />`;
  return `import { ${name} } from '${importFrom}';\n\n${jsx}\n`;
}
