import { Slot } from 'radix-ui';
import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';
import type { NativeProps } from '../lib/types.ts';

export interface SideNavProps extends NativeProps<'nav'> {
  /** Names the navigation landmark, e.g. "Main". */
  'aria-label': string;
  children: React.ReactNode;
}

/** The product's primary navigation, in the left column of AppShell. */
function SideNavRoot({ children, ...rest }: SideNavProps) {
  return (
    <nav className="flex flex-col gap-stack-lg px-3 py-stack-lg" {...rest}>
      {children}
    </nav>
  );
}

export interface SideNavGroupProps extends NativeProps<'div'> {
  /** Group heading, e.g. "Billing". Omit for an untitled first group. */
  title?: string;
  children: React.ReactNode;
}

function SideNavGroup({ title, children, ...rest }: SideNavGroupProps) {
  return (
    <div className="flex flex-col gap-1" {...rest}>
      {title && <p className="m-0 px-2 font-sans text-caption text-fg-muted">{title}</p>}
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">{children}</ul>
    </div>
  );
}

export interface SideNavItemProps extends NativeProps<'a'> {
  /** The current page. Sets aria-current="page" and the selected style. */
  active?: boolean;
  /** Decorative icon before the label. Pass `<Icon name="…" />`. */
  icon?: React.ReactNode;
  /** Render the child (a router Link) instead of an anchor. */
  asChild?: boolean;
  children: React.ReactNode;
}

function SideNavItem({ active = false, icon, asChild, children, ...rest }: SideNavItemProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <li>
      <Comp
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-control-sm items-center gap-2 rounded-control px-2 font-sans text-label-sm',
          'transition-colors duration-fast ease-standard',
          active
            ? 'bg-status-accent-bg text-status-accent-fg'
            : 'text-fg-secondary hover:bg-surface-layer-1-hover hover:text-fg-primary',
          focusRing,
        )}
        {...rest}
      >
        {icon && (
          <span aria-hidden="true" className="inline-flex shrink-0">
            {icon}
          </span>
        )}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Comp>
    </li>
  );
}

/** Primary navigation: groups of links with one active page. */
export const SideNav = Object.assign(SideNavRoot, { Group: SideNavGroup, Item: SideNavItem });
export { SideNavGroup, SideNavItem };
