import { Icon } from '@macaw-ds/icons';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { Text } from '../text/text.tsx';
import { Card } from './card.tsx';

export function Default() {
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-0.5">
          <Card.Title>Gross volume</Card.Title>
          <Card.Description>Last 30 days</Card.Description>
        </div>
        <Badge tone="success" dot>
          Live
        </Badge>
      </Card.Header>
      <Card.Body>
        <Text variant="numeric-lg" numeric>
          $128,430.00
        </Text>
        <Text variant="caption" tone="success">
          +12.4% vs previous period
        </Text>
      </Card.Body>
    </Card>
  );
}

export function KpiRow() {
  const kpis = [
    { label: 'Gross volume', value: '$128,430.00', delta: '+12.4%', tone: 'success' as const },
    { label: 'Net revenue', value: '$96,210.55', delta: '+8.1%', tone: 'success' as const },
    { label: 'Refunds', value: '$2,118.00', delta: '-0.6%', tone: 'critical' as const },
  ];
  return (
    <div className="grid grid-cols-3 gap-4">
      {kpis.map((k) => (
        <Card key={k.label} padding="sm">
          <Card.Body>
            <Text variant="label-sm" tone="secondary">
              {k.label}
            </Text>
            <Text variant="numeric-lg" numeric>
              {k.value}
            </Text>
            <Text variant="caption" tone={k.tone}>
              {k.delta} vs previous period
            </Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export function WithFooter() {
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-col gap-0.5">
          <Card.Title>Payout schedule</Card.Title>
          <Card.Description>Funds arrive two business days after each payout.</Card.Description>
        </div>
      </Card.Header>
      <Card.Body>
        <Text>Payouts run every weekday at 05:00 UTC to the account ending 4421.</Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost">Pause payouts</Button>
        <Button variant="secondary">Change account</Button>
      </Card.Footer>
    </Card>
  );
}

export function Raised() {
  return (
    <Card elevation="raised">
      <Card.Body>
        <Text>A raised card sits on the canvas with a subtle shadow.</Text>
      </Card.Body>
    </Card>
  );
}

export function Interactive() {
  return (
    <Card interactive asChild>
      <a href="/invoices/INV-0041">
        <Card.Header>
          <Card.Title>INV-0041</Card.Title>
          <Icon name="chevron-right" tone="muted" />
        </Card.Header>
        <Card.Body>
          <Text variant="numeric-md" numeric>
            $4,200.00
          </Text>
          <Text variant="caption" tone="muted">
            Due 14 Oct 2026
          </Text>
        </Card.Body>
      </a>
    </Card>
  );
}

export function EdgeToEdge() {
  return (
    <Card padding="none">
      <table className="w-full">
        <thead>
          <tr className="border-b border-line-default text-start">
            <th scope="col" className="px-4 py-2 text-start text-label-sm text-fg-secondary">
              Invoice
            </th>
            <th scope="col" className="px-4 py-2 text-end text-label-sm text-fg-secondary">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['INV-0041', '$4,200.00'],
            ['INV-0040', '$1,180.00'],
          ].map(([id, amount]) => (
            <tr key={id} className="border-b border-line-subtle last:border-b-0">
              <td className="px-4 py-2 text-body-md">{id}</td>
              <td className="px-4 py-2 text-end text-numeric-md text-fg-numeric tabular-nums">
                {amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
