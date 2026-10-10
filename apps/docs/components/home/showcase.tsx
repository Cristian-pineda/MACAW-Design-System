'use client';

import { Icon } from '@macaw-ds/icons';
import { Badge, Button, Card, Text } from '@macaw-ds/ui';
import Link from 'next/link';

/** The hero composition: Card + Button + Badge + Text numeric, the system used on itself. */
export function InvoiceSummary() {
  return (
    <Card elevation="raised">
      <Card.Header>
        <div className="flex flex-col gap-0.5">
          <Card.Title as="h2">Invoice INV-0041</Card.Title>
          <Card.Description>Acme Holdings · due 14 Oct 2026</Card.Description>
        </div>
        <Badge tone="success" dot>
          Paid
        </Badge>
      </Card.Header>
      <Card.Body>
        <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-2">
          <Text as="dt" variant="label-sm" tone="secondary">
            Subtotal
          </Text>
          <Text as="dd" variant="numeric-md" numeric align="end">
            $11,560.00
          </Text>
          <Text as="dt" variant="label-sm" tone="secondary">
            Tax (8%)
          </Text>
          <Text as="dd" variant="numeric-md" numeric align="end">
            $920.00
          </Text>
          <Text as="dt" variant="label-md">
            Total
          </Text>
          <Text as="dd" variant="numeric-lg" numeric align="end">
            $12,480.00
          </Text>
        </dl>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost" size="sm">
          Download PDF
        </Button>
        <Button size="sm">Send receipt</Button>
      </Card.Footer>
    </Card>
  );
}

const LINKS = [
  {
    href: '/components',
    title: 'Components',
    body: 'Manifest-driven primitives with a playground, props, rules and an accessibility panel for each.',
  },
  {
    href: '/tokens',
    title: 'Tokens',
    body: 'Three tiers of DTCG tokens with contrast asserted in both themes. The only source of colour, space and type.',
  },
  {
    href: '/for-agents',
    title: 'For agents',
    body: 'The plugin, the CLI, the MCP tools and the manifest contract Claude reads before it writes a screen.',
  },
];

export function LinkCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {LINKS.map((link) => (
        <Card key={link.href} interactive asChild>
          <Link href={link.href}>
            <Card.Header>
              <Card.Title>{link.title}</Card.Title>
              <Icon name="chevron-right" tone="muted" />
            </Card.Header>
            <Card.Body>
              <Text variant="body-sm" tone="secondary">
                {link.body}
              </Text>
            </Card.Body>
          </Link>
        </Card>
      ))}
    </div>
  );
}
