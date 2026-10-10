import type { Manifest } from '@macaw-ds/manifest';
import { Text } from '@macaw-ds/ui';

function splitKey(entry: string): { keys: string; action: string } {
  const idx = entry.indexOf(':');
  if (idx === -1) return { keys: '', action: entry };
  return { keys: entry.slice(0, idx).trim(), action: entry.slice(idx + 1).trim() };
}

export function A11yPanel({ a11y }: { a11y: Manifest['a11y'] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <dl className="m-0 flex flex-col gap-3 rounded-container border border-line-default bg-surface-default p-4">
        <div className="flex flex-col gap-0.5">
          <Text as="dt" variant="label-sm" tone="secondary">
            Role
          </Text>
          <Text as="dd" variant="body-sm">
            {a11y.role}
          </Text>
        </div>
        <div className="flex flex-col gap-0.5">
          <Text as="dt" variant="label-sm" tone="secondary">
            Accessible name
          </Text>
          <Text as="dd" variant="body-sm">
            {a11y.name}
          </Text>
        </div>
        {a11y.notes.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <Text as="dt" variant="label-sm" tone="secondary">
              Notes
            </Text>
            <dd className="m-0">
              <ul className="m-0 flex list-disc flex-col gap-1 pl-4">
                {a11y.notes.map((note) => (
                  <li key={note} className="text-body-sm text-fg-primary">
                    <Text as="span" variant="body-sm">
                      {note}
                    </Text>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
      <div className="rounded-container border border-line-default bg-surface-default">
        <table className="w-full border-collapse">
          <caption className="px-4 pt-3 pb-2 text-start">
            <Text as="span" variant="label-sm" tone="secondary">
              Keyboard
            </Text>
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-y border-line-subtle px-4 py-2 text-start text-label-sm text-fg-secondary"
              >
                Keys
              </th>
              <th
                scope="col"
                className="border-y border-line-subtle px-4 py-2 text-start text-label-sm text-fg-secondary"
              >
                Behaviour
              </th>
            </tr>
          </thead>
          <tbody>
            {a11y.keyboard.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-2">
                  <Text variant="body-sm" tone="muted">
                    Not interactive; no keyboard handling.
                  </Text>
                </td>
              </tr>
            )}
            {a11y.keyboard.map((entry) => {
              const { keys, action } = splitKey(entry);
              return (
                <tr key={entry}>
                  <td className="border-b border-line-subtle px-4 py-2 align-top whitespace-nowrap">
                    {keys ? (
                      <Text as="span" variant="code">
                        {keys}
                      </Text>
                    ) : (
                      <Text as="span" variant="caption" tone="muted">
                        —
                      </Text>
                    )}
                  </td>
                  <td className="border-b border-line-subtle px-4 py-2 align-top">
                    <Text variant="body-sm">{action}</Text>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
