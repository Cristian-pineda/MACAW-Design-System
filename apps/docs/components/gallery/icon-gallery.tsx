import { Icon, iconNames } from '@macaw-ds/icons';
import { Text } from '@macaw-ds/ui';

/** Icon has no examples file; the gallery renders the whole curated set instead. */
export function IconGallery() {
  return (
    <ul className="m-0 grid list-none grid-cols-6 gap-2 p-0 md:grid-cols-8">
      {iconNames.map((name) => (
        <li
          key={name}
          className="flex flex-col items-center gap-1 rounded-container border border-line-subtle bg-surface-layer-1 p-2"
        >
          <Icon name={name} size="lg" />
          <Text as="span" variant="caption" tone="muted" truncate title={name}>
            {name}
          </Text>
        </li>
      ))}
    </ul>
  );
}

export function IconSizes() {
  return (
    <div className="flex items-center gap-3">
      <Icon name="check-circle" size="sm" tone="success" />
      <Icon name="check-circle" size="md" tone="success" />
      <Icon name="check-circle" size="lg" tone="success" />
      <Icon name="check-circle" size="xl" tone="success" />
    </div>
  );
}

export function IconTones() {
  return (
    <div className="flex items-center gap-3">
      {(
        [
          'primary',
          'secondary',
          'muted',
          'success',
          'warning',
          'critical',
          'info',
          'accent',
        ] as const
      ).map((tone) => (
        <Icon key={tone} name="alert-circle" tone={tone} label={`${tone} tone`} />
      ))}
    </div>
  );
}
