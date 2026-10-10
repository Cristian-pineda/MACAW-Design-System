import type * as React from 'react';
import type { NativeProps } from '../lib/types.ts';

export interface TopBarProps extends NativeProps<'header'> {
  /** Product mark and name, usually a link to home. */
  brand: React.ReactNode;
  /** Optional centre content, such as a search field or environment switcher. */
  children?: React.ReactNode;
  /** Right-aligned actions: help, notifications, theme toggle, account. */
  actions?: React.ReactNode;
}

/** The application's global header. Sticky at the top of AppShell, on surface layer-1. */
export function TopBar({ brand, children, actions, ...rest }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-sticky flex h-topbar shrink-0 items-center gap-4 border-b border-line-default bg-surface-layer-1 px-4"
      {...rest}
    >
      <div className="flex shrink-0 items-center gap-2">{brand}</div>
      <div className="flex min-w-0 flex-1 items-center">{children}</div>
      {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
    </header>
  );
}
