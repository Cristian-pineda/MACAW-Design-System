'use client';

import { SideNav } from '@macaw-ds/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavGroup, NavLink } from './nav';

function isActive(pathname: string, link: NavLink): boolean {
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

/** The docs' primary navigation: the system SideNav with Next links; the active item follows the route. */
export function DocsSideNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <SideNav aria-label="Documentation">
      {groups.map((group) => (
        <SideNav.Group key={group.title} title={group.title}>
          {group.links.map((link) => (
            <SideNav.Item key={link.href} asChild active={isActive(pathname, link)}>
              <Link href={link.href}>{link.label}</Link>
            </SideNav.Item>
          ))}
        </SideNav.Group>
      ))}
    </SideNav>
  );
}
