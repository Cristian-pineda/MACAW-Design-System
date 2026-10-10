import { Badge } from './badge.tsx';

export function Default() {
  return <Badge tone="success">Paid</Badge>;
}

export function Tones() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="neutral">Draft</Badge>
      <Badge tone="success">Paid</Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="critical">Overdue</Badge>
      <Badge tone="info">Refunded</Badge>
      <Badge tone="accent">Featured</Badge>
    </div>
  );
}

export function Variants() {
  return (
    <div className="flex flex-col gap-2">
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          <Badge variant={variant} tone="neutral">
            Draft
          </Badge>
          <Badge variant={variant} tone="success">
            Paid
          </Badge>
          <Badge variant={variant} tone="warning">
            Pending
          </Badge>
          <Badge variant={variant} tone="critical">
            Overdue
          </Badge>
          <Badge variant={variant} tone="info">
            Refunded
          </Badge>
          <Badge variant={variant} tone="accent">
            Featured
          </Badge>
        </div>
      ))}
    </div>
  );
}

export function WithDot() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="success" dot>
        Active
      </Badge>
      <Badge tone="neutral" dot>
        Paused
      </Badge>
      <Badge tone="critical" dot variant="outline">
        Failing
      </Badge>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" tone="warning">
        Pending
      </Badge>
      <Badge size="md" tone="warning">
        Pending
      </Badge>
    </div>
  );
}
