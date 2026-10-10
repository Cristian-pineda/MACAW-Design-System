import type { ReactNode } from 'react';
import { getComponentSummaries } from '@/lib/registry';
import { Header } from './header';
import { SidebarNav, type NavGroup } from './sidebar-nav';

const FOUNDATIONS = [
  'color',
  'typography',
  'spacing',
  'elevation',
  'motion',
  'accessibility',
] as const;

function navGroups(): NavGroup[] {
  const components = getComponentSummaries();
  return [
    { title: 'Start', links: [{ href: '/getting-started', label: 'Getting started' }] },
    {
      title: 'Foundations',
      links: FOUNDATIONS.map((f) => ({
        href: `/foundations/${f}`,
        label: f.charAt(0).toUpperCase() + f.slice(1),
      })),
    },
    {
      title: 'Components',
      links: [
        { href: '/components', label: 'All components' },
        ...components.map((c) => ({ href: `/components/${c.slug}`, label: c.title })),
      ],
    },
    {
      title: 'Reference',
      links: [
        { href: '/tokens', label: 'Tokens' },
        { href: '/for-agents', label: 'For agents' },
      ],
    },
  ];
}

/** Header, sidebar and main column. Desktop-first at 1024 px (DECISIONS.md #3). */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="sticky top-14 hidden max-h-dvh w-60 shrink-0 self-start overflow-y-auto border-r border-line-default bg-surface-default px-3 py-6 md:block">
          <SidebarNav groups={navGroups()} />
        </aside>
        <main id="main" className="min-w-0 flex-1 px-6 py-8 md:px-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
