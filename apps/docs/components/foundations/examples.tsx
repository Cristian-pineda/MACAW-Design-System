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
    <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface-default p-6">
      <Text as="h3" variant="display-md">
        Invoices
      </Text>
      <Text variant="body-md" tone="secondary">
        Body text at 14 px with 20 px leading. Headings tighten tracking; captions widen it.
      </Text>
      <dl className="max-w-sm m-0 grid grid-cols-2 gap-x-6 gap-y-1">
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
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-default p-5">
      <Text as="h3" variant="heading-sm">
        Form section (stack-md between fields, control-gap between buttons)
      </Text>
      <div className="flex flex-col gap-4">
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
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}

export function ElevationExample() {
  return (
    <div className="grid gap-4 rounded-container bg-surface-canvas p-6 md:grid-cols-2">
      <Card>
        <Card.Body>
          <Text variant="label-md">flat</Text>
          <Text variant="body-sm" tone="secondary">
            The default. Structure from the border alone.
          </Text>
        </Card.Body>
      </Card>
      <Card elevation="raised">
        <Card.Body>
          <Text variant="label-md">raised</Text>
          <Text variant="body-sm" tone="secondary">
            A subtle shadow for cards that float over the canvas.
          </Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export function MotionExample() {
  return <MotionDemo durations={tokensByPrefix('duration.', 'primitive')} />;
}

/** Focus ring, target size and labelled control in one place. */
export function AccessibilityExample() {
  return (
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-default p-5">
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
