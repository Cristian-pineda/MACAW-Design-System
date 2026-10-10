import { Icon } from '@macaw-ds/icons';
import { AppShell, Button, Text, TopBar } from '@macaw-ds/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { getComponentSummaries } from '@/lib/registry';
import { GITHUB_URL, SITE_NAME } from '@/lib/site';
import { DensityToggle } from './density-toggle';
import { DocsSideNav } from './docs-side-nav';
import { navGroups } from './nav';
import { ThemeToggle } from './theme-toggle';

function Brand() {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 rounded-control', focusRing)}>
      <span aria-hidden="true" className="inline-block size-3 rounded-xs bg-action-primary" />
      <Text as="span" variant="heading-md">
        {SITE_NAME}
      </Text>
      <Text as="span" variant="caption" tone="muted">
        Design system
      </Text>
    </Link>
  );
}

/** The docs dogfood the system frame: AppShell, TopBar and SideNav (DECISIONS.md #21). Desktop-first at 1024 px (#3). */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      sideNavLabel="Site"
      topBar={
        <TopBar
          brand={<Brand />}
          actions={
            <>
              <Button asChild variant="ghost" size="sm" iconEnd={<Icon name="external-link" />}>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Button>
              <DensityToggle />
              <ThemeToggle />
            </>
          }
        />
      }
      sideNav={<DocsSideNav groups={navGroups(getComponentSummaries())} />}
    >
      {children}
    </AppShell>
  );
}
