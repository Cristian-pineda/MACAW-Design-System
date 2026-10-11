import { Icon } from '@macaw-ds/icons';
import { Button, Card, CardBody, CardHeader, CardTitle, PageHeader, Text } from '@macaw-ds/ui';
import type * as React from 'react';

export interface DashboardKpi {
  /** What is measured, e.g. "Net revenue". */
  label: string;
  /** The formatted figure, e.g. "$96,210.55". Rendered with tabular numerals. */
  value: string;
  /** Change against the comparison period, e.g. "+3.1%". */
  delta?: string;
  /** Direction of the change; picks the arrow. */
  trend?: 'up' | 'down';
  /** Whether the change is good or bad news. Up is not always good: overdue going up is critical. */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** Context after the delta, e.g. "vs last 30 days" or "7 invoices". */
  note?: string;
}

export interface DashboardTemplateProps {
  /** The page title, rendered as the page's h1. */
  title?: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** Page actions: the period picker and at most one primary Button. */
  actions?: React.ReactNode;
  /** Three or four KPIs. Four sit on col-span-3, three on col-span-4. */
  kpis?: DashboardKpi[];
  /** The wide panel (col-span-8): a chart or the list that needs attention. */
  primary?: React.ReactNode;
  /** The narrow panel (col-span-4): upcoming events, a short list. */
  secondary?: React.ReactNode;
}

const SENTIMENT_TONE = { positive: 'success', negative: 'critical', neutral: 'muted' } as const;

function KpiCard({
  label,
  value,
  delta,
  trend,
  sentiment = 'neutral',
  note,
  compact,
}: DashboardKpi & { compact: boolean }) {
  const tone = SENTIMENT_TONE[sentiment];
  return (
    <Card padding="sm">
      <CardBody>
        <div className="flex flex-col gap-1">
          <Text variant="label-sm" tone="secondary">
            {label}
          </Text>
          <Text variant={compact ? 'numeric-md' : 'numeric-lg'} numeric>
            {value}
          </Text>
          {(delta || note) && (
            <div className="flex flex-wrap items-center gap-x-1">
              {delta && trend && (
                <Icon
                  name={trend === 'up' ? 'trending-up' : 'trending-down'}
                  size="sm"
                  tone={tone}
                />
              )}
              {delta && (
                <Text as="span" variant="caption" tone={tone} numeric>
                  {delta}
                </Text>
              )}
              {note && (
                <Text as="span" variant="caption" tone="muted">
                  {note}
                </Text>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Text tone="secondary">Panel content: a chart, a list or a table.</Text>
      </CardBody>
    </Card>
  );
}

const PLACEHOLDER_KPIS: DashboardKpi[] = [
  { label: 'Metric one', value: '0.00', note: 'Comparison' },
  { label: 'Metric two', value: '0.00', note: 'Comparison' },
  { label: 'Metric three', value: '0.00', note: 'Comparison' },
  { label: 'Metric four', value: '0.00', note: 'Comparison' },
];

/**
 * Dashboard page: a PageHeader, a row of three or four KPIs, then an 8 + 4 split of panels.
 * Renders the main area only.
 */
export function DashboardTemplate({
  title = 'Overview',
  description = 'Key figures for the selected period.',
  actions = (
    <Button variant="secondary" iconStart={<Icon name="calendar" />}>
      Last 30 days
    </Button>
  ),
  kpis = PLACEHOLDER_KPIS,
  primary = <PlaceholderPanel title="Primary panel" />,
  secondary = <PlaceholderPanel title="Secondary panel" />,
}: DashboardTemplateProps) {
  // Four KPIs share the row on col-span-3 with the smaller numeral so values fit at 1024 px.
  const four = kpis.length >= 4;
  return (
    <>
      <PageHeader title={title} description={description} actions={actions} />
      <div className="flex max-w-page flex-col gap-gutter px-margin py-section">
        <ul aria-label="Key figures" className="layout-grid m-0 list-none gap-y-gutter p-0">
          {kpis.map((kpi) => (
            <li key={kpi.label} className={four ? 'col-span-3' : 'col-span-4'}>
              <KpiCard {...kpi} compact={four} />
            </li>
          ))}
        </ul>
        <div className="layout-grid items-start gap-y-gutter">
          <div className="col-span-8 flex min-w-0 flex-col gap-gutter">{primary}</div>
          <div className="col-span-4 flex min-w-0 flex-col gap-gutter">{secondary}</div>
        </div>
      </div>
    </>
  );
}
