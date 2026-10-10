'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Renders each component's own focus style through the force-focus variant (data-force-focus),
 * and also focuses the first focusable descendant on mount so the real :focus-visible path runs.
 */
export function FocusFirst({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} data-force-focus="" data-testid="gallery-focused">
      {children}
    </div>
  );
}
