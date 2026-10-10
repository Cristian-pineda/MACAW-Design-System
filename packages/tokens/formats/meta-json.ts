import type { Format } from 'style-dictionary/types';
import { tierOf } from './shared.ts';

export interface TokenMeta {
  name: string;
  cssVar: string;
  path: string[];
  type: string;
  tier: 'primitive' | 'semantic' | 'component';
  description?: string;
  original: unknown;
  value: unknown;
  file: string;
}

/** Flat JSON with the resolved value for one theme. The build merges light and dark. */
export const metaJson: Format = {
  name: 'macaw/meta',
  format: ({ dictionary }) => {
    const tokens: TokenMeta[] = dictionary.allTokens.map((t) => ({
      name: t.path.join('.'),
      cssVar: `--${t.name}`,
      path: t.path,
      type: String(t.$type ?? t.type ?? 'unknown'),
      tier: tierOf(t),
      description: t.$description ? String(t.$description) : undefined,
      original: t.original?.$value ?? t.original?.value,
      value: t.$value ?? t.value,
      file: String(t.filePath ?? '').replace(/^.*\/src\//, 'src/'),
    }));
    return JSON.stringify(tokens, null, 2) + '\n';
  },
};
