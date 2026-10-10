'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const NAMED_LANDMARKS = 'nav[aria-label], aside[aria-label], [role="region"][aria-label]';

/**
 * Galleries render every example several times (light, dark, focused, the overview). Examples name
 * their landmarks ("Main", "Invoice sections"), and the same name twice on one page is an axe
 * landmark-unique failure that a real product page would not have. This appends the context
 * ("Main, Default, dark") once after mount so each repeated landmark has a unique name.
 */
export function UniqueLandmarks({ suffix, children }: { suffix: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll<HTMLElement>(NAMED_LANDMARKS).forEach((el) => {
      if (el.dataset.landmarkSuffix === suffix) return;
      el.setAttribute('aria-label', `${el.getAttribute('aria-label') ?? ''}, ${suffix}`);
      el.dataset.landmarkSuffix = suffix;
    });
  }, [suffix]);
  return <div ref={ref}>{children}</div>;
}
