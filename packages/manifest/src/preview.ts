import type { Manifest } from './schema.ts';

export interface PreviewControls {
  /** Show the "Show focus" control. */
  focus: boolean;
  /** Show the "Reduced motion" control. */
  motion: boolean;
  /** Why a control is hidden or needs a prop, for a hint next to the controls. */
  hints: string[];
}

/**
 * Which preview controls apply to a component with the given prop values. The playground calls
 * this instead of guessing, so a control never appears where it can do nothing.
 */
export function previewControls(
  manifest: Manifest,
  props: Record<string, unknown>,
): PreviewControls {
  const hints: string[] = [];
  const f = manifest.a11y.focusable;
  let focus = f === true;
  if (typeof f === 'object') {
    focus = props[f.whenProp] === true;
    if (!focus) hints.push(`Focus applies when ${f.whenProp} is on.`);
  }
  let motion = manifest.motion !== undefined;
  if (manifest.motion?.whenProp && props[manifest.motion.whenProp] !== true) {
    hints.push(`Motion is visible when ${manifest.motion.whenProp} is on.`);
  }
  if (manifest.motion === undefined) motion = false;
  return { focus, motion, hints };
}
