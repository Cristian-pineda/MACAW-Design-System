'use client';

import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Card, Input, Text } from '@macaw-ds/ui';
import { MotionDemo } from '@/components/tokens/motion-demo';
import { tokensByPrefix } from '@/lib/tokens';

/** The same card in both modes: only the semantic layer changes. */
export function ColorExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="rounded-container bg-surface-canvas p-6 text-fg-primary"
        >
          <Card>
            <Card.Header>
              <div className="flex flex-col gap-0.5">
                <Card.Title>Net revenue</Card.Title>
                <Card.Description>
                  {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </Card.Description>
              </div>
              <Badge tone="success" dot>
                Live
              </Badge>
            </Card.Header>
            <Card.Body>
              <Text variant="numeric-lg" numeric>
                $96,210.55
              </Text>
              <Text variant="caption" tone="critical">
                -0.6% vs previous period
              </Text>
            </Card.Body>
            <Card.Footer>
              <Button size="sm" variant="secondary">
                Export
              </Button>
            </Card.Footer>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function TypographyExample() {
  return (
    <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface-layer-1 p-6">
      <Text as="h3" variant="display-md">
        Invoices
      </Text>
      <Text variant="body-md" tone="secondary">
        Body text at 14 px with 20 px leading. Headings tighten tracking; captions widen it.
      </Text>
      <dl className="m-0 grid w-96 grid-cols-2 gap-x-6 gap-y-1">
        <Text as="dt" variant="label-sm" tone="secondary">
          Outstanding
        </Text>
        <Text as="dd" variant="numeric-md" numeric align="end">
          $12,480.00
        </Text>
        <Text as="dt" variant="label-sm" tone="secondary">
          Overdue
        </Text>
        <Text as="dd" variant="numeric-md" numeric align="end" tone="critical">
          $1,112.40
        </Text>
      </dl>
      <Text as="span" variant="code">
        txn_1Nv2hZ
      </Text>
    </div>
  );
}

export function SpacingExample() {
  return (
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-layer-1 p-5">
      <Text as="h3" variant="heading-sm">
        Form section (stack-md between fields, inline-sm between buttons)
      </Text>
      <div className="flex flex-col gap-stack-md">
        <div className="flex w-72 flex-col gap-1">
          <Text as="label" variant="label-sm" htmlFor="spacing-ref">
            Invoice reference
          </Text>
          <Input id="spacing-ref" placeholder="INV-0041" />
        </div>
        <div className="flex w-72 flex-col gap-1">
          <Text as="label" variant="label-sm" htmlFor="spacing-amount">
            Amount (USD)
          </Text>
          <Input id="spacing-amount" align="end" placeholder="0.00" startAdornment="$" />
        </div>
      </div>
      <div className="flex items-center justify-end gap-inline-sm">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export function ElevationExample() {
  return (
    <div className="layout-grid gap-y-gutter rounded-container border border-line-default bg-surface-canvas p-6">
      <div className="col-span-4">
        <Card>
          <Card.Body>
            <Text variant="label-md">Tone</Text>
            <Text variant="body-sm" tone="secondary">
              A layer-1 card on the canvas. The step in tone already separates it.
            </Text>
          </Card.Body>
          <Card.Footer>
            <Text variant="caption" tone="muted">
              Footer on layer-2
            </Text>
          </Card.Footer>
        </Card>
      </div>
      <div className="col-span-4">
        <Card>
          <Card.Body>
            <Text variant="label-md">Border</Text>
            <Text variant="body-sm" tone="secondary">
              The 1 px line keeps the edge crisp where tones are close, as in dark mode.
            </Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-span-4">
        <Card elevation="raised">
          <Card.Body>
            <Text variant="label-md">Shadow, last</Text>
            <Text variant="body-sm" tone="secondary">
              raised: only for a card that floats over the canvas.
            </Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export function MotionExample() {
  return <MotionDemo durations={tokensByPrefix('duration.', 'primitive')} />;
}

/** Focus ring, target size and labelled control in one place. */
export function AccessibilityExample() {
  return (
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-layer-1 p-5">
      <Text variant="body-sm" tone="secondary">
        Tab through these: the same 2 px outline at 2 px offset appears on every control, and every
        target is at least 24 px tall.
      </Text>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small, 28 px</Button>
        <Button variant="secondary">Medium, 32 px</Button>
        <Button iconOnly variant="ghost" aria-label="More actions">
          <Icon name="more-horizontal" />
        </Button>
        <div className="flex w-56 flex-col gap-1">
          <Text as="label" variant="label-sm" htmlFor="a11y-search">
            Search transactions
          </Text>
          <Input
            id="a11y-search"
            type="search"
            placeholder="Search"
            startAdornment={<Icon name="search" />}
          />
        </div>
      </div>
    </div>
  );
}

const INVOICES = [
  { id: 'INV-0041', customer: 'Acme Holdings', amount: '$12,480.00', status: 'Overdue' },
  { id: 'INV-0040', customer: 'Northwind Traders', amount: '$1,112.40', status: 'Paid' },
  { id: 'INV-0039', customer: 'Globex', amount: '$98,000.00', status: 'Paid' },
  { id: 'INV-0038', customer: 'Initech', amount: '−$240.00', status: 'Refunded' },
] as const;

/** Tabular numerals line up in an end-aligned column; the negative amount pairs a sign with the tone. */
export function NumeralsExample() {
  return (
    <div className="overflow-x-auto rounded-container border border-line-default bg-surface-layer-1">
      <table className="w-full border-collapse">
        <caption className="sr-only">Recent invoices</caption>
        <thead className="bg-surface-layer-2">
          <tr>
            {['Invoice', 'Customer', 'Status', 'Amount (USD)'].map((h) => (
              <th
                key={h}
                scope="col"
                className={`border-b border-line-default px-3 py-2 text-label-sm text-fg-secondary ${h.startsWith('Amount') ? 'text-end' : 'text-start'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {INVOICES.map((row) => (
            <tr key={row.id}>
              <td className="border-b border-line-subtle px-3 py-2">
                <Text as="span" variant="code">
                  {row.id}
                </Text>
              </td>
              <td className="border-b border-line-subtle px-3 py-2">
                <Text as="span" variant="body-sm">
                  {row.customer}
                </Text>
              </td>
              <td className="border-b border-line-subtle px-3 py-2">
                <Badge
                  size="sm"
                  tone={
                    row.status === 'Overdue'
                      ? 'critical'
                      : row.status === 'Paid'
                        ? 'success'
                        : 'neutral'
                  }
                >
                  {row.status}
                </Badge>
              </td>
              <td className="border-b border-line-subtle px-3 py-2">
                <Text
                  variant="numeric-md"
                  numeric
                  align="end"
                  tone={row.amount.startsWith('−') ? 'critical' : undefined}
                >
                  {row.amount}
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
