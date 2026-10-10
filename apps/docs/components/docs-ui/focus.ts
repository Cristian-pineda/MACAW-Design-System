/**
 * Same string as packages/ui/src/lib/focus.ts; copied on purpose so the docs never import from @macaw-ds/ui/src.
 * The force-focus variant renders the same ring without focus inside a `data-force-focus` scope.
 */
export const focusRing = [
  'outline-none',
  'focus-visible:outline-solid focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
  'force-focus:outline-solid force-focus:outline-focus force-focus:outline-offset-focus force-focus:outline-focus-ring',
].join(' ');
