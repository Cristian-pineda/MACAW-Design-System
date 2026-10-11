'use client';

import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Card, Input, SideNav, Text, TopBar } from '@macaw-ds/ui';
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
