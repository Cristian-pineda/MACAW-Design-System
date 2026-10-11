import { Icon } from '@macaw-ds/icons';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  PageHeader,
  TabNav,
  Text,
} from '@macaw-ds/ui';
import type * as React from 'react';

export interface RecordSummaryItem {
  /** The label, e.g. "Amount due". */
  term: string;
  /** The value. Strings render as body text; pass a `<Text numeric>` or a Badge for anything else. */
  value: React.ReactNode;
}

export interface RecordSummaryProps {
  /** Card title, rendered as an h2. */
  title?: string;
  items: RecordSummaryItem[];
}

/** The summary card for the side column: a definition list of label and value pairs. */
export function RecordSummary({ title = 'Summary', items }: RecordSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <dl className="m-0 flex flex-col gap-stack-sm">
          {items.map((item) => (
            <div key={item.term} className="flex flex-col gap-0.5">
              <Text as="dt" variant="label-sm" tone="secondary">
                {item.term}
              </Text>
              {typeof item.value === 'string' ? (
                <Text as="dd" variant="body-md">
                  {item.value}
                </Text>
              ) : (
                <dd className="m-0">{item.value}</dd>
              )}
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}

export interface RecordTemplateProps {
  /** The record's name or ID, rendered as the page's h1. */
  title?: React.ReactNode;
  /** One line under the title: the counterparty, key dates. */
  description?: React.ReactNode;
  /** Next to the title: the record's status Badge. */
  meta?: React.ReactNode;
  /** Record actions: one primary Button at most. */
  actions?: React.ReactNode;
  /** A TabNav, one URL per tab. It sticks below the TopBar while the page scrolls. */
  tabs?: React.ReactNode;
  /** The side column, usually a RecordSummary. */
  summary?: React.ReactNode;
  /** The main column: the active tab's content. */
  children?: React.ReactNode;
}

function PlaceholderTabs() {
  return (
    <TabNav aria-label="Record sections">
      <TabNav.Item href="#overview" active>
        Overview
      </TabNav.Item>
      <TabNav.Item href="#details">Details</TabNav.Item>
      <TabNav.Item href="#activity">Activity</TabNav.Item>
    </TabNav>
  );
}

function PlaceholderMain() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Overview</CardTitle>
      </CardHeader>
      <CardBody>
        <Text tone="secondary">The active tab&apos;s content goes in the main column.</Text>
      </CardBody>
    </Card>
  );
}

const PLACEHOLDER_SUMMARY: RecordSummaryItem[] = [
  { term: 'Owner', value: 'Name' },
  { term: 'Created', value: 'Date' },
  { term: 'Last updated', value: 'Date' },
];

/**
 * Record page: a PageHeader with status, actions and section tabs, then an 8 + 4 split with the
 * active tab's content on the left and a summary on the right. Renders the main area only.
 */
export function RecordTemplate({
  title = 'Record name',
  description = 'Counterparty · Key date',
  meta = <Badge tone="neutral">Status</Badge>,
  actions = (
    <>
      <Button variant="secondary" iconStart={<Icon name="pencil" />}>
        Edit
      </Button>
      <Button>Primary action</Button>
    </>
  ),
  tabs = <PlaceholderTabs />,
  summary = <RecordSummary items={PLACEHOLDER_SUMMARY} />,
  children = <PlaceholderMain />,
}: RecordTemplateProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        meta={meta}
        actions={actions}
        tabs={tabs}
      />
      <div className="layout-grid max-w-page items-start gap-y-gutter px-margin py-section">
        <div className="col-span-8 flex min-w-0 flex-col gap-gutter">{children}</div>
        <div className="col-span-4 flex min-w-0 flex-col gap-gutter">{summary}</div>
      </div>
    </>
  );
}
