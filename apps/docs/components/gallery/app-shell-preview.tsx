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

const LINES = [
  { item: 'Platform fee, October', amount: '$9,800.00' },
  { item: 'Card processing, 4,120 transactions', amount: '$1,360.00' },
  { item: 'Payout acceleration', amount: '$400.00' },
  { item: 'Tax (8%)', amount: '$920.00' },
];

/**
 * AppShell rendered inside a page. The real AppShell owns the page's banner and main landmarks,
 * and the docs page already has them, so this preview composes the same parts (TopBar, a layer-1
 * side column with SideNav, PageHeader and content) in a fixed-height frame that scrolls like a
 * window: the TopBar and the tab row stick, the side column stretches the full height.
 */
export function Default() {
  return (
    <div className="isolate h-120 w-full overflow-y-auto rounded-container border border-line-default bg-surface-canvas text-fg-primary">
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
              <SideNav.Item href="#home" icon={<Icon name="home" />}>
                Home
              </SideNav.Item>
              <SideNav.Item href="#balances" icon={<Icon name="wallet" />}>
                Balances
              </SideNav.Item>
            </SideNav.Group>
            <SideNav.Group title="Billing">
              <SideNav.Item href="#invoices" icon={<Icon name="receipt" />} active>
                Invoices
              </SideNav.Item>
              <SideNav.Item href="#customers" icon={<Icon name="users" />}>
                Customers
              </SideNav.Item>
            </SideNav.Group>
          </SideNav>
        </div>
        <div className="min-w-0 flex-1">
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
        </div>
      </div>
    </div>
  );
}
