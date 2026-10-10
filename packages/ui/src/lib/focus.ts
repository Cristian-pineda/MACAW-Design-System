/**
 * The one focus style every interactive component uses (DECISIONS.md #8).
 * Rendered with `outline` so it survives forced-colors mode; the ring colour meets 3:1 on every
 * surface layer. The force-focus variant renders the same style without focus, scoped by
 * data-force-focus, so previews and visual tests show the component's real focus style.
 */
export const focusRing = [
  'outline-none',
  'focus-visible:outline-solid focus-visible:outline-focus focus-visible:outline-offset-focus focus-visible:outline-focus-ring',
  'force-focus:outline-solid force-focus:outline-focus force-focus:outline-offset-focus force-focus:outline-focus-ring',
].join(' ');
