import { Icon } from '@macaw-ds/icons';
import { Button } from './button.tsx';

export function Default() {
  return <Button>Pay invoice</Button>;
}

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Pay invoice</Button>
      <Button variant="secondary">Download PDF</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Void invoice</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button iconStart={<Icon name="download" />} variant="secondary">
        Export
      </Button>
      <Button iconEnd={<Icon name="arrow-right" />}>Continue</Button>
      <Button iconOnly aria-label="More actions" variant="ghost">
        <Icon name="more-horizontal" />
      </Button>
    </div>
  );
}

export function States() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button loading>Processing</Button>
      <Button disabled>Unavailable</Button>
      <Button variant="secondary" disabled>
        Unavailable
      </Button>
      <Button variant="ghost" disabled>
        Unavailable
      </Button>
    </div>
  );
}

export function AsLink() {
  return (
    <Button asChild variant="secondary" iconEnd={<Icon name="external-link" />}>
      <a href="https://example.com/receipt" target="_blank" rel="noreferrer">
        View receipt
      </a>
    </Button>
  );
}

export function ActionBar() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button variant="secondary">Save draft</Button>
      <Button>Send invoice</Button>
    </div>
  );
}
