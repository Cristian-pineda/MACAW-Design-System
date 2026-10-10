import type { Format } from 'style-dictionary/types';
import { hasReference, header, referencesToVars } from './shared.ts';

/**
 * Emits `--macaw-*` variables inside a selector. Tokens whose source value is a reference
 * are emitted as `var(--macaw-…)` so the cascade stays live under [data-theme="dark"].
 */
export const cssVariablesThemed: Format = {
  name: 'macaw/css-themed',
  format: ({ dictionary, options }) => {
    const selector: string = options?.selector ?? ':root';
    const lines = dictionary.allTokens.map((t) => {
      const original = t.original?.$value ?? t.original?.value;
      const value = hasReference(original)
        ? referencesToVars(original)
        : String(t.$value ?? t.value);
      const comment = t.$description ? ` /* ${String(t.$description).replace(/\*\//g, '')} */` : '';
      return `  --${t.name}: ${value};${comment}`;
    });
    const body = `${selector} {\n${lines.join('\n')}\n}\n`;
    return options?.withHeader === false ? body : header() + body;
  },
};
