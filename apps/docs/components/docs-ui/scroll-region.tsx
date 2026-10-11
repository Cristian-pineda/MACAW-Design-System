import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { focusRing } from './focus';

export interface ScrollRegionProps {
  /** Names the region for assistive technology, e.g. "Button props". */
  label: string;
  className?: string;
  children?: ReactNode;
  /** For pre-rendered HTML such as highlighted code. */
  html?: string;
}

/**
 * A horizontally scrollable area that keyboard users can reach and scroll (WCAG 2.1.1, axe
 * scrollable-region-focusable): a named group in the tab order with the shared focus ring.
 * A group, not a region: pages have many of these, and landmarks should stay few and unique.
 * Docs-local (DECISIONS.md #13).
 */
export function ScrollRegion({ label, className, children, html }: ScrollRegionProps) {
  const props = {
    role: 'group' as const,
    'aria-label': label,
    tabIndex: 0,
    className: cn('overflow-x-auto', focusRing, className),
  };
  return html !== undefined ? (
    <div {...props} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div {...props}>{children}</div>
  );
}
