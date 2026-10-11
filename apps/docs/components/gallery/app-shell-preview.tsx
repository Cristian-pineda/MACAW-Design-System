import { Icon } from '@macaw-ds/icons';
import {
  Badge,
  Button,
  CardBody,
  CardHeader,
  CardTitle,
  Card,
  PageHeader,
  SideNav,
  TabNav,
  Text,
  TopBar,
} from '@macaw-ds/ui';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

const LINES = [
  { item: 'Platform fee, October', amount: '$9,800.00' },
  { item: 'Card processing, 4,120 transactions', amount: '$1,360.00' },
  { item: 'Payout acceleration', amount: '$400.00' },
  { item: 'Tax (8%)', amount: '$920.00' },
];

export type FrameNavItem = 'home' | 'balances' | 'invoices' | 'customers' | 'settings';

export interface AppShellFrameProps {
  /** The main area: a PageHeader followed by content. */
  children: ReactNode;
  /** The SideNav item marked as the current page. */
  active?: FrameNavItem;
  /** md: a component preview; lg: a full template or page. */
  height?: 'md' | 'lg';
}

/**
 * AppShell rendered inside a page. The real AppShell owns the page's banner and main landmarks,
 * and the docs page already has them, so this preview composes the same parts (TopBar, a layer-1
 * side column with SideNav, PageHeader and content) in a fixed-height frame that scrolls like a
 * window: the TopBar and the tab row stick, the side column stretches the full height.
 */
export function AppShellFrame({
  children,
  active = 'invoices',
  height = 'md',
}: AppShellFrameProps) {
  return (
    <div
      className={cn(
        'isolate w-full overflow-y-auto rounded-container border border-line-default bg-surface-canvas text-fg-primary',
        height === 'lg' ? 'h-180' : 'h-120',
      )}
    >
      <TopBar
        brand={
          <a
            href="#home"
            className={cn('inline-flex items-center gap-2 rounded-control', focusRing)}
          >
            <span aria-hidden="true" className="inline-block size-3 rounded-xs bg-action-primary" />
            <Text as="span" variant="heading-md">
              Perch
            </Text>
          </a>
        }
        actions={
          <>
            <Button iconOnly variant="ghost" aria-label="Notifications">
              <Icon name="bell" />
            </Button>
            <Button iconOnly variant="ghost" aria-label="Settings">
              <Icon name="settings" />
            </Button>
          </>
        }
      >
        <Text as="span" variant="label-sm" tone="muted">
          Test mode
        </Text>
      </TopBar>
      <div className="flex">
        <div className="w-sidenav shrink-0 border-r border-line-default bg-surface-layer-1">
          <SideNav aria-label="Main">
            <SideNav.Group>
              <SideNav.Item href="#home" icon={<Icon name="home" />} active={active === 'home'}>
                Home
              </SideNav.Item>
              <SideNav.Item
                href="#balances"
                icon={<Icon name="wallet" />}
                active={active === 'balances'}
              >
                Balances
              </SideNav.Item>
            </SideNav.Group>
            <SideNav.Group title="Billing">
              <SideNav.Item
                href="#invoices"
                icon={<Icon name="receipt" />}
                active={active === 'invoices'}
              >
                Invoices
              </SideNav.Item>
              <SideNav.Item
                href="#customers"
                icon={<Icon name="users" />}
                active={active === 'customers'}
              >
                Customers
              </SideNav.Item>
            </SideNav.Group>
            <SideNav.Group title="Account">
              <SideNav.Item
                href="#settings"
                icon={<Icon name="settings" />}
                active={active === 'settings'}
              >
                Settings
              </SideNav.Item>
            </SideNav.Group>
          </SideNav>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** The AppShell gallery example: the frame with an invoice record in the main area. */
export function Default() {
  return (
    <AppShellFrame>
      <PageHeader
        headingLevel="h2"
        title="INV-0041"
        description="Acme Corporation · Due 14 Oct 2026"
        meta={<Badge tone="critical">Overdue</Badge>}
        actions={
          <>
            <Button variant="secondary">Download PDF</Button>
            <Button>Send reminder</Button>
          </>
        }
        tabs={
          <TabNav aria-label="Invoice sections">
            <TabNav.Item href="#overview" active>
              Overview
            </TabNav.Item>
            <TabNav.Item href="#payments">Payments</TabNav.Item>
            <TabNav.Item href="#activity">Activity</TabNav.Item>
          </TabNav>
        }
      />
      <div className="layout-grid gap-y-gutter px-margin py-section">
        {[
          ['Amount due', '$12,480.00'],
          ['Paid', '$0.00'],
          ['Days overdue', '12'],
        ].map(([label, value]) => (
          <div key={label} className="col-span-4">
            <Card padding="sm">
              <CardBody>
                <Text variant="label-sm" tone="secondary">
                  {label}
                </Text>
                <Text variant="numeric-lg" numeric>
                  {value}
                </Text>
              </CardBody>
            </Card>
          </div>
        ))}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Line items</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="m-0 grid grid-cols-2 gap-y-stack-sm">
                {LINES.map((line) => (
                  <div key={line.item} className="col-span-2 grid grid-cols-2">
                    <Text as="dt" variant="body-sm">
                      {line.item}
                    </Text>
                    <Text as="dd" variant="numeric-md" numeric align="end">
                      {line.amount}
                    </Text>
                  </div>
                ))}
              </dl>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShellFrame>
  );
}
