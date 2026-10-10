/** Joins class strings for docs-local markup. Only token utilities belong in these strings. */
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ');
}
