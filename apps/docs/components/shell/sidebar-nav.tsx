'use client';

import { Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <Text as="span" variant="caption" tone="muted">
            {group.title}
          </Text>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {group.links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex h-7 items-center rounded-control px-2 transition-colors duration-fast ease-standard',
                      active ? 'bg-status-accent-bg' : 'hover:bg-action-ghost-hover',
                      focusRing,
                    )}
                  >
                    <Text as="span" variant="label-sm" tone={active ? 'accent' : 'secondary'}>
                      {link.label}
                    </Text>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
