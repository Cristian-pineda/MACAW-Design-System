import { Icon } from '@macaw-ds/icons';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@macaw-ds/ui';
import { DashboardTemplate, type DashboardKpi } from '../dashboard-template/dashboard-template.tsx';

const KPIS: DashboardKpi[] = [
  {
    label: 'Gross volume',
    value: '$128,430.00',
    delta: '+12.4%',
    trend: 'up',
    sentiment: 'positive',
    note: 'vs last 30 days',
  },
  {
    label: 'Net revenue',
    value: '$96,210.55',
    delta: '+3.1%',
    trend: 'up',
    sentiment: 'positive',
    note: 'vs last 30 days',
  },
  {
    label: 'Outstanding',
    value: '$38,905.20',
    delta: '-4.8%',
    trend: 'down',
    sentiment: 'positive',
    note: '9 invoices',
  },
  {
    label: 'Overdue',
    value: '$17,312.40',
    delta: '+2',
    trend: 'up',
    sentiment: 'negative',
    note: 'invoices this week',
  },
];

const OVERDUE = [
  {
    id: 'INV-0041',
    customer: 'Acme Corporation',
    due: 'Due 28 Sep 2026',
    days: '12 days overdue',
    amount: '$12,420.00',
  },
  {
    id: 'INV-0037',
    customer: 'Northwind Traders',
    due: 'Due 1 Oct 2026',
    days: '9 days overdue',
    amount: '$3,180.00',
  },
  {
    id: 'INV-0035',
    customer: 'Globex Industries',
    due: 'Due 4 Oct 2026',
    days: '6 days overdue',
    amount: '$1,240.40',
  },
  {
    id: 'INV-0033',
    customer: 'Initech LLC',
    due: 'Due 7 Oct 2026',
    days: '3 days overdue',
    amount: '$472.00',
  },
];

const PAYOUTS = [
  { date: '14 Oct', dateTime: '2026-10-14', amount: '$42,000.00', status: 'In transit' },
  { date: '21 Oct', dateTime: '2026-10-21', amount: '$38,750.00', status: 'Scheduled' },
  { date: '28 Oct', dateTime: '2026-10-28', amount: '$15,460.55', status: 'Scheduled' },
];

function NeedsAttention() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-0.5">
          <CardTitle as="h2">Needs attention</CardTitle>
          <CardDescription>Overdue invoices, oldest first.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" iconEnd={<Icon name="arrow-right" />}>
          View all
        </Button>
      </CardHeader>
      <CardBody>
        <ul aria-label="Overdue invoices" className="m-0 flex list-none flex-col p-0">
          {OVERDUE.map((invoice) => (
            <li
              key={invoice.id}
              className="layout-grid items-center border-b border-line-subtle py-stack-sm last:border-b-0"
            >
              <div className="col-span-5 flex min-w-0 flex-col">
                <Text variant="label-md" truncate>
                  {invoice.customer}
                </Text>
                <Text variant="code" tone="muted">
                  {invoice.id}
                </Text>
              </div>
              <div className="col-span-4 flex flex-col items-start gap-1">
                <Badge tone="critical" size="sm">
                  Overdue
                </Badge>
                <Text variant="caption" tone="muted">
                  {invoice.days}
                </Text>
              </div>
              <div className="col-span-3">
                <Text variant="numeric-md" numeric align="end">
                  {invoice.amount}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function UpcomingPayouts() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-0.5">
          <CardTitle as="h2">Upcoming payouts</CardTitle>
          <CardDescription>To Chase ···· 4421.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        <ul aria-label="Upcoming payouts" className="m-0 flex list-none flex-col p-0">
          {PAYOUTS.map((payout) => (
            <li
              key={payout.dateTime}
              className="flex items-start justify-between gap-4 border-b border-line-subtle py-stack-sm last:border-b-0"
            >
              <div className="flex flex-col items-start gap-1">
                <Text as="time" variant="label-md" dateTime={payout.dateTime} numeric>
                  {payout.date}
                </Text>
                <Badge tone={payout.status === 'In transit' ? 'info' : 'neutral'} size="sm">
                  {payout.status}
                </Badge>
              </div>
              <Text variant="numeric-md" numeric align="end">
                {payout.amount}
              </Text>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

/** Billing overview: volume and revenue KPIs, overdue invoices to chase, and the next payouts. */
export function BillingDashboard() {
  return (
    <DashboardTemplate
      title="Billing"
      description="Volume, revenue and invoices that need attention, last 30 days."
      actions={
        <>
          <Button variant="secondary" iconStart={<Icon name="calendar" />}>
            Last 30 days
          </Button>
          <Button iconStart={<Icon name="plus" />}>Create invoice</Button>
        </>
      }
      kpis={KPIS}
      primary={<NeedsAttention />}
      secondary={<UpcomingPayouts />}
    />
  );
}
