'use client';

import { TabNav } from '@macaw-ds/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { TabLink } from './nav';

/** Page tabs, one URL each: the system TabNav with Next links; the tab matching the path is active. */
export function DocsTabNav({ label, tabs }: { label: string; tabs: TabLink[] }) {
  const pathname = usePathname();
  return (
    <TabNav aria-label={label}>
      {tabs.map((tab) => (
        <TabNav.Item key={tab.href} asChild active={pathname === tab.href}>
          <Link href={tab.href}>{tab.label}</Link>
        </TabNav.Item>
      ))}
    </TabNav>
  );
}
