'use client';

import { Icon } from '@macaw-ds/icons';
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  SideNav,
  TabNav,
  Text,
  TopBar,
} from '@macaw-ds/ui';
import type { ReactNode } from 'react';

const SPANS = [
  { label: '12', spans: [12] },
  { label: '6 + 6', spans: [6, 6] },
  { label: '4 + 4 + 4', spans: [4, 4, 4] },
  { label: '3 × 4', spans: [3, 3, 3, 3] },
  { label: '8 + 4', spans: [8, 4] },
] as const;

const COL_SPAN: Record<number, string> = {
  3: 'col-span-3',
  4: 'col-span-4',
  6: 'col-span-6',
  8: 'col-span-8',
  12: 'col-span-12',
};

/** The 12 columns, then the common splits, rendered with the real layout-grid utility. */
export function GridDemo() {
  return (
    <div className="flex flex-col gap-stack-md rounded-container border border-line-default bg-surface-canvas px-margin py-stack-lg">
      <div className="layout-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex h-10 items-center justify-center rounded-xs bg-status-accent-bg"
          >
            <Text as="span" variant="caption" tone="accent">
              {i + 1}
            </Text>
          </div>
        ))}
      </div>
      {SPANS.map((row) => (
        <div key={row.label} className="layout-grid">
          {row.spans.map((span, i) => (
            <div
              key={i}
              className={`${COL_SPAN[span]} flex h-12 items-center rounded-control border border-line-default bg-surface-layer-1 px-3`}
            >
              <Text as="span" variant="code" tone="secondary">
                col-span-{span}
              </Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function FormComposition({ id }: { id: string }) {
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-0.5">
          <Card.Title>Payout schedule</Card.Title>
          <Card.Description>Next payout on 14 Oct 2026</Card.Description>
        </div>
        <Badge tone="success" dot>
          Active
        </Badge>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col gap-stack-md">
          <div className="flex flex-col gap-1">
            <Text as="label" variant="label-sm" htmlFor={`${id}-account`}>
              Bank account
            </Text>
            <Input id={`${id}-account`} defaultValue="Chase ···· 4421" />
          </div>
          <div className="flex flex-col gap-1">
            <Text as="label" variant="label-sm" htmlFor={`${id}-minimum`}>
              Minimum payout (USD)
            </Text>
            <Input id={`${id}-minimum`} align="end" startAdornment="$" defaultValue="500.00" />
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save schedule</Button>
      </Card.Footer>
    </Card>
  );
}

/** The same composition in a comfortable scope and a compact scope, side by side. */
export function DensityDemo() {
  return (
    <div className="layout-grid gap-y-gutter">
      {(['comfortable', 'compact'] as const).map((density) => (
        <div
          key={density}
          data-density={density}
          className="col-span-6 flex flex-col gap-stack-sm rounded-container border border-line-default bg-surface-canvas p-4"
        >
          <Text as="span" variant="label-sm" tone="secondary">
            data-density=&quot;{density}&quot;
          </Text>
          <FormComposition id={`density-${density}`} />
        </div>
      ))}
    </div>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-stack-sm">
      <Text as="span" variant="caption" tone="muted">
        {label}
      </Text>
      <div className="isolate overflow-hidden rounded-container border border-line-default bg-surface-canvas text-fg-primary">
        {children}
      </div>
    </div>
  );
}

const ROWS = [
  ['INV-0041', 'Acme Holdings', 'Overdue', '$12,480.00'],
  ['INV-0040', 'Northwind Traders', 'Paid', '$1,112.40'],
  ['INV-0039', 'Globex', 'Draft', '$98,000.00'],
] as const;

export function AppShellTemplate() {
  return (
    <Frame label="Inside the root layout">
      <TopBar
        brand={
          <Text as="span" variant="heading-md">
            Perch
          </Text>
        }
        actions={
          <Button iconOnly variant="ghost" aria-label="Notifications (app shell template)">
            <Icon name="bell" />
          </Button>
        }
      />
      <div className="flex">
        <div className="w-sidenav shrink-0 border-r border-line-default bg-surface-layer-1">
          <SideNav aria-label="Main (app shell template)">
            <SideNav.Group title="Billing">
              <SideNav.Item href="#template-invoices" icon={<Icon name="receipt" />} active>
                Invoices
              </SideNav.Item>
              <SideNav.Item href="#template-customers" icon={<Icon name="users" />}>
                Customers
              </SideNav.Item>
            </SideNav.Group>
          </SideNav>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-stack-sm px-margin py-section">
          <Text variant="body-sm" tone="secondary">
            The page renders here: a PageHeader, then the content.
          </Text>
        </div>
      </div>
    </Frame>
  );
}

export function ListTemplate() {
  return (
    <Frame label="List page">
      <PageHeader
        headingLevel="h2"
        title="Invoices"
        description="Every invoice across your customers, newest first."
        actions={<Button iconStart={<Icon name="plus" />}>New invoice</Button>}
      />
      <div className="flex flex-col gap-stack-md px-margin py-section">
        <div className="w-80">
          <Input
            type="search"
            aria-label="Search invoices"
            placeholder="Search invoices"
            startAdornment={<Icon name="search" />}
          />
        </div>
        <div className="overflow-x-auto rounded-container border border-line-default bg-surface-layer-1">
          <table className="w-full border-collapse">
            <caption className="sr-only">Invoices</caption>
            <thead className="bg-surface-layer-2">
              <tr>
                {['Invoice', 'Customer', 'Status', 'Amount'].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className={`border-b border-line-default px-3 py-2 text-label-sm text-fg-secondary ${h === 'Amount' ? 'text-end' : 'text-start'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([id, customer, status, amount]) => (
                <tr key={id} className="hover:bg-surface-layer-1-hover">
                  <td className="border-b border-line-subtle px-3 py-2">
                    <Text as="span" variant="code">
                      {id}
                    </Text>
                  </td>
                  <td className="border-b border-line-subtle px-3 py-2">
                    <Text as="span" variant="body-sm">
                      {customer}
                    </Text>
                  </td>
                  <td className="border-b border-line-subtle px-3 py-2">
                    <Badge
                      size="sm"
                      tone={
                        status === 'Overdue'
                          ? 'critical'
                          : status === 'Paid'
                            ? 'success'
                            : 'neutral'
                      }
                    >
                      {status}
                    </Badge>
                  </td>
                  <td className="border-b border-line-subtle px-3 py-2">
                    <Text variant="numeric-md" numeric align="end">
                      {amount}
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Frame>
  );
}

export function RecordTemplate() {
  return (
    <Frame label="Record page with tabs">
      <PageHeader
        headingLevel="h2"
        title="INV-0041"
        description="Acme Holdings · Due 14 Oct 2026"
        meta={<Badge tone="critical">Overdue</Badge>}
        actions={
          <>
            <Button variant="secondary">Download PDF</Button>
            <Button>Send reminder</Button>
          </>
        }
        tabs={
          <TabNav aria-label="Invoice sections (record template)">
            <TabNav.Item href="#record-overview" active>
              Overview
            </TabNav.Item>
            <TabNav.Item href="#record-payments">Payments</TabNav.Item>
            <TabNav.Item href="#record-activity">Activity</TabNav.Item>
          </TabNav>
        }
      />
      <div className="layout-grid gap-y-gutter px-margin py-section">
        <div className="col-span-8">
          <Card>
            <Card.Header>
              <Card.Title>Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="m-0 grid grid-cols-2 gap-y-stack-sm">
                <Text as="dt" variant="label-sm" tone="secondary">
                  Customer
                </Text>
                <Text as="dd" variant="body-sm">
                  Acme Holdings
                </Text>
                <Text as="dt" variant="label-sm" tone="secondary">
                  Issued
                </Text>
                <Text as="dd" variant="body-sm" numeric>
                  14 Sep 2026
                </Text>
              </dl>
            </Card.Body>
          </Card>
        </div>
        <div className="col-span-4">
          <Card>
            <Card.Body>
              <Text variant="label-sm" tone="secondary">
                Amount due
              </Text>
              <Text variant="numeric-lg" numeric>
                $12,480.00
              </Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Frame>
  );
}

const KPIS = [
  ['Gross volume', '$128,430.00', '+12.4%'],
  ['Net revenue', '$96,210.55', '+3.1%'],
  ['Outstanding', '$12,480.00', '4 invoices'],
  ['Payouts', '$84,000.00', 'Next on 14 Oct'],
] as const;

export function DashboardTemplate() {
  return (
    <Frame label="Dashboard with a KPI row">
      <PageHeader
        headingLevel="h2"
        title="Overview"
        actions={<Button variant="secondary">Last 30 days</Button>}
      />
      <div className="layout-grid gap-y-gutter px-margin py-section">
        {KPIS.map(([label, value, note]) => (
          <div key={label} className="col-span-3">
            <Card padding="sm">
              <Card.Body>
                <Text variant="label-sm" tone="secondary">
                  {label}
                </Text>
                <Text variant="numeric-md" numeric>
                  {value}
                </Text>
                <Text variant="caption" tone="muted">
                  {note}
                </Text>
              </Card.Body>
            </Card>
          </div>
        ))}
        <div className="col-span-8">
          <Card>
            <Card.Header>
              <Card.Title>Volume</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="flex h-24 items-end gap-1" aria-hidden="true">
                {[40, 55, 35, 70, 60, 85, 75, 90, 65, 95, 80, 100].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-xs bg-data-1"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>Recent payouts</Card.Title>
            </Card.Header>
            <Card.Body>
              <Text variant="numeric-md" numeric>
                $42,000.00
              </Text>
              <Text variant="caption" tone="muted">
                Paid on 30 Sep 2026
              </Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Frame>
  );
}

export function FormTemplate() {
  return (
    <Frame label="Form or settings page">
      <PageHeader
        headingLevel="h2"
        title="Business settings"
        description="Shown on invoices and receipts."
      />
      <div className="px-margin py-section">
        <div className="max-w-form">
          <Card>
            <Card.Body>
              <div className="flex flex-col gap-stack-md">
                <div className="flex flex-col gap-1">
                  <Text as="label" variant="label-sm" htmlFor="template-legal-name">
                    Legal name
                  </Text>
                  <Input id="template-legal-name" defaultValue="Acme Holdings, Inc." />
                </div>
                <div className="flex flex-col gap-1">
                  <Text as="label" variant="label-sm" htmlFor="template-email">
                    Billing email
                  </Text>
                  <Input id="template-email" type="email" defaultValue="billing@acme.test" />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost">Cancel</Button>
              <Button>Save changes</Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </Frame>
  );
}

const CONTAINERS = [
  ['max-w-prose', '720px', 'Reading text: docs, help, long descriptions.'],
  ['max-w-form', '640px', 'Single-column forms and settings.'],
  ['max-w-page', '1280px', 'The default page content width.'],
  ['max-w-wide', '1536px', 'Wide tables and dashboards on large screens.'],
] as const;

const CONTAINER_CLASS: Record<string, string> = {
  'max-w-prose': 'max-w-prose',
  'max-w-form': 'max-w-form',
  'max-w-page': 'max-w-page',
  'max-w-wide': 'max-w-wide',
};

/** Each container width as a bar inside the main column, capped by the column itself. */
export function ContainersDemo() {
  return (
    <div className="flex flex-col gap-stack-sm rounded-container border border-line-default bg-surface-canvas p-4">
      {CONTAINERS.map(([utility, value, use]) => (
        <div
          key={utility}
          className={`${CONTAINER_CLASS[utility]} flex flex-col gap-0.5 rounded-control border border-line-default bg-surface-layer-1 px-3 py-2`}
        >
          <Text as="span" variant="code">
            {utility} · {value}
          </Text>
          <Text as="span" variant="caption" tone="muted">
            {use}
          </Text>
        </div>
      ))}
    </div>
  );
}
