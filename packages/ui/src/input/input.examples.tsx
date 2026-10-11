import { Icon } from '@macaw-ds/icons';
import { Text } from '../text/text.tsx';
import { Input } from './input.tsx';

export function Default() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-1">
      <Text as="label" variant="label-sm" htmlFor="ex-ref">
        Invoice reference
      </Text>
      <Input id="ex-ref" placeholder="INV-0041" />
    </div>
  );
}

export function Amount() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-1">
      <Text as="label" variant="label-sm" htmlFor="ex-amount">
        Amount (USD)
      </Text>
      <Input
        id="ex-amount"
        align="end"
        inputMode="decimal"
        placeholder="0.00"
        startAdornment="$"
        endAdornment="USD"
      />
      <Text variant="caption" tone="muted">
        Charged on the 1st of each month.
      </Text>
    </div>
  );
}

export function Invalid() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-1">
      <Text as="label" variant="label-sm" htmlFor="ex-email">
        Billing email
      </Text>
      <Input
        id="ex-email"
        type="email"
        invalid
        defaultValue="finance@acme"
        aria-describedby="ex-email-error"
      />
      <Text id="ex-email-error" variant="caption" tone="critical">
        Enter a full email address, like finance@acme.com.
      </Text>
    </div>
  );
}

export function Search() {
  return (
    <Input
      type="search"
      aria-label="Search transactions"
      placeholder="Search transactions"
      startAdornment={<Icon name="search" />}
    />
  );
}

export function Sizes() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  );
}

export function States() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2">
      <Input aria-label="Disabled" disabled defaultValue="Locked" />
      <Input aria-label="Read only" readOnly defaultValue="acct_1Nv2hZ" />
    </div>
  );
}
