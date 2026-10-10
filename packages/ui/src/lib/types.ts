import type * as React from 'react';

/**
 * Native props for an element minus the attributes MACAW components never expose:
 * className and style (DECISIONS.md #9) and the legacy `color` attribute.
 */
export type NativeProps<T extends keyof React.JSX.IntrinsicElements> = Omit<
  React.ComponentPropsWithoutRef<T>,
  'className' | 'style' | 'color'
>;
