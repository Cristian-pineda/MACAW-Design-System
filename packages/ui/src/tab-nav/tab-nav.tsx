import { Slot } from 'radix-ui';
import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';
import type { NativeProps } from '../lib/types.ts';

export interface TabNavProps extends NativeProps<'nav'> {
  /** Names the navigation landmark, e.g. "Button sections". Required: a page can have several navs. */
  'aria-label': string;
  children: React.ReactNode;
}

/**
 * Page-level tabs where each tab is its own URL. This is navigation (links with aria-current),
 * not an in-page tablist: use it for sections of a page that can be linked and bookmarked.
 */
function TabNavRoot({ children, ...rest }: TabNavProps) {
  return (
    <nav {...rest}>
      <ul className="m-0 flex list-none flex-wrap items-stretch gap-1 p-0">{children}</ul>
    </nav>
  );
}

export interface TabNavItemProps extends NativeProps<'a'> {
  /** The current page. Sets aria-current="page" and the selected style. */
  active?: boolean;
  /** Render the child (a router Link) instead of an anchor. */
  asChild?: boolean;
  children: React.ReactNode;
}

function TabNavItem({ active = false, asChild, children, ...rest }: TabNavItemProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <li className="flex">
      <Comp
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative -mb-px inline-flex h-control-lg items-center border-b-2 px-3 font-sans text-label-md whitespace-nowrap',
          'transition-colors duration-fast ease-standard',
          active
            ? 'border-action-primary text-fg-primary'
            : 'border-transparent text-fg-secondary hover:border-line-strong hover:text-fg-primary',
          focusRing,
        )}
        {...rest}
      >
        {children}
      </Comp>
    </li>
  );
}

/** Tabs for page sections, one URL per tab. Compose `TabNav.Item` (or `TabNavItem`) inside. */
export const TabNav = Object.assign(TabNavRoot, { Item: TabNavItem });
export { TabNavItem };
