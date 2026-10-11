import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Card, Input, PageHeader, Text } from '@macaw-ds/ui';
import type * as React from 'react';

export interface ListTemplateProps {
  /** The page title, rendered as the page's h1. */
  title?: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** Page actions: the page's one primary Button and its secondaries. */
  actions?: React.ReactNode;
  /** The row above the list: search, filters, bulk actions. */
  toolbar?: React.ReactNode;
  /** The list itself, rendered on a layer-1 Card with no padding. Usually a `ul` of rows. */
  children?: React.ReactNode;
}

const PLACEHOLDER_ROWS = [
  { id: 'item-1', name: 'Item one', detail: 'Secondary detail', status: 'Active', value: '$0.00' },
  { id: 'item-2', name: 'Item two', detail: 'Secondary detail', status: 'Active', value: '$0.00' },
  { id: 'item-3', name: 'Item three', detail: 'Secondary detail', status: 'Draft', value: '$0.00' },
  { id: 'item-4', name: 'Item four', detail: 'Secondary detail', status: 'Draft', value: '$0.00' },
];

function PlaceholderToolbar() {
  return (
    <>
      <div className="w-full max-w-80">
        <Input
          type="search"
          aria-label="Search items"
          placeholder="Search items"
          startAdornment={<Icon name="search" />}
        />
      </div>
      <Button variant="secondary" iconStart={<Icon name="filter" />}>
        Filter
      </Button>
    </>
  );
}

function PlaceholderList() {
  return (
    <ul aria-label="Items" className="m-0 list-none p-0">
      {PLACEHOLDER_ROWS.map((row) => (
        <li
          key={row.id}
          className="layout-grid items-center border-b border-line-subtle px-card-x py-stack-sm last:border-b-0"
        >
          <div className="col-span-6 flex min-w-0 flex-col">
            <Text variant="label-md" truncate>
              {row.name}
            </Text>
            <Text variant="body-sm" tone="muted" truncate>
              {row.detail}
            </Text>
          </div>
          <div className="col-span-3">
            <Badge tone={row.status === 'Active' ? 'success' : 'neutral'} size="sm">
              {row.status}
            </Badge>
          </div>
          <div className="col-span-3">
            <Text variant="numeric-md" numeric align="end">
              {row.value}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * List page: a PageHeader with the one primary action, a toolbar row, then the list on a
 * layer-1 card. Renders the main area only; AppShell, TopBar and main come from the root layout.
 */
export function ListTemplate({
  title = 'Items',
  description = 'Every item in this collection, newest first.',
  actions = <Button iconStart={<Icon name="plus" />}>New item</Button>,
  toolbar = <PlaceholderToolbar />,
  children = <PlaceholderList />,
}: ListTemplateProps) {
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      <div className="flex max-w-page flex-col gap-stack-md px-margin py-section">
        <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
        <Card padding="none">{children}</Card>
      </div>
    </>
  );
}
