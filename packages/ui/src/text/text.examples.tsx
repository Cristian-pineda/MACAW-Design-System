import { Text } from './text.tsx';

export function Default() {
  return <Text>Available balance</Text>;
}

export function Roles() {
  return (
    <div className="flex flex-col gap-2">
      <Text as="h1" variant="display-lg">
        Display lg
      </Text>
      <Text as="h2" variant="display-md">
        Display md
      </Text>
      <Text as="h2" variant="heading-lg">
        Heading lg
      </Text>
      <Text as="h3" variant="heading-md">
        Heading md
      </Text>
      <Text as="h4" variant="heading-sm">
        Heading sm
      </Text>
      <Text variant="body-lg">Body lg: the quick brown fox settles the invoice.</Text>
      <Text variant="body-md">Body md: the quick brown fox settles the invoice.</Text>
      <Text variant="body-sm">Body sm: the quick brown fox settles the invoice.</Text>
      <Text as="span" variant="label-md">
        Label md
      </Text>
      <Text as="span" variant="label-sm">
        Label sm
      </Text>
      <Text variant="caption" tone="muted">
        Caption: updated 2 minutes ago
      </Text>
      <Text as="span" variant="code">
        code: txn_1Nv2hZ
      </Text>
    </div>
  );
}

export function Money() {
  return (
    <div className="flex w-48 flex-col gap-1">
      <Text variant="numeric-lg" numeric align="end">
        $12,480.00
      </Text>
      <Text variant="numeric-md" numeric align="end">
        $1,112.40
      </Text>
      <Text variant="numeric-sm" numeric align="end" tone="critical">
        -$320.00
      </Text>
    </div>
  );
}

export function Tones() {
  return (
    <div className="flex flex-col gap-1">
      {(
        [
          'primary',
          'secondary',
          'muted',
          'numeric',
          'success',
          'warning',
          'critical',
          'info',
          'accent',
        ] as const
      ).map((tone) => (
        <Text key={tone} tone={tone} variant="label-md">
          {tone}
        </Text>
      ))}
    </div>
  );
}

export function Truncated() {
  return (
    <div className="w-56">
      <Text truncate title="A very long merchant descriptor that will not fit on one line">
        A very long merchant descriptor that will not fit on one line
      </Text>
    </div>
  );
}
