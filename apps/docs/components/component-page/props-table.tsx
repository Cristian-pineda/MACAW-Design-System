import type { Manifest } from '@macaw-ds/manifest';
import { Text } from '@macaw-ds/ui';
import { ScrollRegion } from '@/components/docs-ui/scroll-region';

function typeOf(spec: Manifest['props'][string]): string {
  if (spec.type === 'enum' && spec.values) return spec.values.map((v) => `"${v}"`).join(' | ');
  if (spec.type === 'node') return 'ReactNode';
  if (spec.type === 'function') return 'function';
  return spec.type;
}

export function PropsTable({ manifest }: { manifest: Manifest }) {
  const rows = Object.entries(manifest.props);
  return (
    <ScrollRegion
      label={`${manifest.name} props`}
      className="rounded-container border border-line-default"
    >
      <table className="w-full border-collapse">
        <thead className="bg-surface-layer-2">
          <tr>
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b border-line-default px-3 py-2 text-start text-label-sm text-fg-secondary"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, spec]) => (
            <tr key={name}>
              <td className="border-b border-line-subtle px-3 py-2 align-top whitespace-nowrap">
                <Text as="span" variant="code">
                  {name}
                  {spec.required ? '*' : ''}
                </Text>
              </td>
              <td className="border-b border-line-subtle px-3 py-2 align-top">
                <Text as="span" variant="code" tone="secondary">
                  {typeOf(spec)}
                </Text>
              </td>
              <td className="border-b border-line-subtle px-3 py-2 align-top whitespace-nowrap">
                <Text as="span" variant="code" tone="secondary">
                  {spec.default === undefined ? '—' : String(spec.default)}
                </Text>
              </td>
              <td className="border-b border-line-subtle px-3 py-2 align-top">
                <Text variant="body-sm">{spec.description}</Text>
                {spec.a11y && (
                  <Text variant="caption" tone="muted">
                    Accessibility: {spec.a11y}
                  </Text>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
