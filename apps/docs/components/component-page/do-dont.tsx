import { Icon } from '@macaw-ds/icons';
import { Text } from '@macaw-ds/ui';

function List({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'success' | 'critical';
}) {
  return (
    <div className="flex flex-col gap-3 rounded-container border border-line-default bg-surface-default p-4">
      <div className="flex items-center gap-2">
        <Icon name={tone === 'success' ? 'check-circle' : 'x-circle'} tone={tone} />
        <Text as="h3" variant="heading-sm" tone={tone}>
          {title}
        </Text>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Icon name={tone === 'success' ? 'check' : 'x'} size="sm" tone={tone} />
            <Text variant="body-sm">{item}</Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <List title="Do" items={dos} tone="success" />
      <List title="Don't" items={donts} tone="critical" />
    </div>
  );
}
