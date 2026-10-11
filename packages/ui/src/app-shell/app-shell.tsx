import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';
import type { NativeProps } from '../lib/types.ts';

export interface AppShellProps extends NativeProps<'div'> {
  /** The TopBar. */
  topBar: React.ReactNode;
  /** The SideNav. Omit for pages without primary navigation. */
  sideNav?: React.ReactNode;
  /** Accessible name for the side column landmark. */
  sideNavLabel?: string;
  /** id of the main element; the skip link targets it. */
  mainId?: string;
  /**
   * Accessible name for main. Only needed when several apps share one screen-reader landmark list,
   * such as an app embedded in an iframe inside another app.
   */
  mainLabel?: string;
  /** Text of the skip link, the first Tab stop on the page. */
  skipLinkLabel?: string;
  /** The page: usually a PageHeader followed by content. */
  children: React.ReactNode;
}

/**
 * The application frame: skip link, sticky TopBar, a full-height SideNav column on layer-1 that
 * scrolls on its own, and the main area on the canvas. The window scrolls the main content.
 * Below the 1024px floor nothing is sticky and the side column stacks above main, so the page
 * reflows at 320px (WCAG 1.4.10).
 */
export function AppShell({
  topBar,
  sideNav,
  sideNavLabel = 'Primary',
  mainId = 'main',
  mainLabel,
  skipLinkLabel = 'Skip to main content',
  children,
  ...rest
}: AppShellProps) {
  return (
    <div data-macaw-app-shell="" className="min-h-dvh bg-surface-canvas text-fg-primary" {...rest}>
      <a
        href={`#${mainId}`}
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-toast focus:rounded-control focus:bg-surface-overlay focus:px-3 focus:py-2 focus:font-sans focus:text-label-md focus:text-fg-primary focus:shadow-overlay',
          focusRing,
        )}
      >
        {skipLinkLabel}
      </a>
      {topBar}
      <div className="flex flex-col md:flex-row">
        {sideNav && (
          <aside
            aria-label={sideNavLabel}
            className="w-full shrink-0 border-b border-line-default bg-surface-layer-1 md:sticky md:top-topbar md:h-below-topbar md:w-sidenav md:overflow-y-auto md:border-r md:border-b-0"
          >
            {sideNav}
          </aside>
        )}
        <main
          id={mainId}
          aria-label={mainLabel}
          tabIndex={-1}
          className="min-w-0 flex-1 outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
