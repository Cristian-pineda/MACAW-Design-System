import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, TabNav, Text } from '@macaw-ds/ui';
import {
  RecordSummary,
  RecordTemplate,
  type RecordSummaryItem,
} from '../record-template/record-template.tsx';

const LINE_ITEMS = [
  {
    id: 'platform',
    item: 'Platform fee, October 2026',
    quantity: '1 × $9,800.00',
    amount: '$9,800.00',
  },
  { id: 'processing', item: 'Card processing', quantity: '4,000 × $0.34', amount: '$1,360.00' },
  { id: 'acceleration', item: 'Payout acceleration', quantity: '1 × $340.00', amount: '$340.00' },
];

const TOTALS = [
  { term: 'Subtotal', value: '$11,500.00' },
  { term: 'Tax (8%)', value: '$920.00' },
  { term: 'Total', value: '$12,420.00' },
  { term: 'Amount paid', value: '$0.00' },
];

const SUMMARY: RecordSummaryItem[] = [
  {
    term: 'Amount due',
    value: (
      <Text as="span" variant="numeric-lg" numeric>
        $12,420.00
      </Text>
    ),
  },
  {
    term: 'Due date',
    value: (
      <div className="flex flex-wrap items-center gap-2">
        <Text as="time" dateTime="2026-09-28" numeric>
          28 Sep 2026
        </Text>
        <Badge tone="critical" size="sm">
          12 days overdue
        </Badge>
      </div>
    ),
  },
  { term: 'Customer', value: 'Acme Corporation' },
  { term: 'Terms', value: 'Net 14' },
];

function LineItems() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Line items</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-stack-md">
          <ul aria-label="Line items" className="m-0 flex list-none flex-col p-0">
            {LINE_ITEMS.map((line) => (
              <li
                key={line.id}
                className="layout-grid items-center border-b border-line-subtle py-stack-sm"
              >
                <div className="col-span-8 flex min-w-0 flex-col">
                  <Text variant="label-md">{line.item}</Text>
                  <Text variant="caption" tone="muted" numeric>
                    {line.quantity}
                  </Text>
                </div>
                <div className="col-span-4">
                  <Text variant="numeric-md" numeric align="end">
                    {line.amount}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
          <dl className="m-0 ml-auto flex w-full max-w-80 flex-col gap-stack-xs">
            {TOTALS.map((row) => (
              <div key={row.term} className="grid grid-cols-2 items-center">
                <Text as="dt" variant="body-sm" tone="secondary">
                  {row.term}
                </Text>
                <Text as="dd" variant="numeric-md" numeric align="end">
                  {row.value}
                </Text>
              </div>
            ))}
            <div className="grid grid-cols-2 items-center border-t border-line-default pt-stack-sm">
              <Text as="dt" variant="label-md">
                Amount due
              </Text>
              <Text as="dd" variant="numeric-lg" numeric align="end">
                $12,420.00
              </Text>
            </div>
          </dl>
        </div>
      </CardBody>
    </Card>
  );
}

/** Invoice INV-0041: overdue, with line items, totals and a summary of what is owed and when. */
export function InvoiceRecord() {
  return (
    <RecordTemplate
      title="INV-0041"
      description="Acme Corporation · Issued 14 Sep 2026 · Due 28 Sep 2026"
      meta={<Badge tone="critical">Overdue</Badge>}
      actions={
        <>
          <Button variant="ghost">Void</Button>
          <Button variant="secondary" iconStart={<Icon name="download" />}>
            Download PDF
          </Button>
          <Button iconStart={<Icon name="mail" />}>Send reminder</Button>
        </>
      }
      tabs={
        <TabNav aria-label="Invoice sections">
          <TabNav.Item href="#overview" active>
            Overview
          </TabNav.Item>
          <TabNav.Item href="#line-items">Line items</TabNav.Item>
          <TabNav.Item href="#payments">Payments</TabNav.Item>
          <TabNav.Item href="#activity">Activity</TabNav.Item>
        </TabNav>
      }
      summary={<RecordSummary title="Summary" items={SUMMARY} />}
    >
      <LineItems />
    </RecordTemplate>
  );
}
