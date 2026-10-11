import { tokenValues, type TokenName } from '@macaw-ds/tokens';
import { formatHex, parse } from 'culori';

/**
 * Hex for a token's light value. For surfaces that cannot read CSS variables (social images,
 * the web app manifest), so they still follow the token files instead of hard-coded colours.
 */
export function tokenHex(name: TokenName): string {
  const raw = String(tokenValues[name].light);
  const ref = raw.match(/^\{(.+)\}$/);
  const value = ref ? String(tokenValues[ref[1] as TokenName].light) : raw;
  const parsed = parse(value);
  if (!parsed) throw new Error(`tokenHex: cannot parse ${name} = ${value}`);
  return formatHex(parsed);
}
