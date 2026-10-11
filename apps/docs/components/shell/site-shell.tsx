import { Icon } from '@macaw-ds/icons';
import { AppShell, Button, Text, TopBar } from '@macaw-ds/ui';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { getBlocks } from '@/lib/blocks';
import { getComponentSummaries } from '@/lib/registry';
import { GITHUB_URL, SITE_NAME } from '@/lib/site';
import { DensityToggle } from './density-toggle';
import { DocsSideNav } from './docs-side-nav';
import { navGroups } from './nav';
import { ThemeToggle } from './theme-toggle';

function Brand() {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 rounded-control', focusRing)}>
      {/* Decorative: the link's text already says MACAW. */}
      <Image
        src="/brand/macaw-avatar.png"
        alt=""
        width={28}
        height={28}
        priority
        className="size-7 shrink-0"
      />
      <Text as="span" variant="heading-md">
        {SITE_NAME}
      </Text>
      <span className="hidden md:inline">
        <Text as="span" variant="caption" tone="muted">
          Design system
        </Text>
      </span>
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
              {/* Below the 1024px floor the actions collapse to icons so the bar reflows at 320px (WCAG 1.4.10). */}
              <span className="hidden md:inline-flex">
                <Button asChild variant="ghost" size="sm" iconEnd={<Icon name="external-link" />}>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    GitHub<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              </span>
              <span className="inline-flex md:hidden">
                <Button asChild variant="ghost" iconOnly aria-label="GitHub (opens in a new tab)">
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                    <Icon name="external-link" />
                  </a>
                </Button>
              </span>
              <DensityToggle />
              <ThemeToggle />
            </>
          }
        />
      }
      sideNav={<DocsSideNav groups={navGroups(getComponentSummaries(), getBlocks())} />}
    >
      {children}
    </AppShell>
  );
}
