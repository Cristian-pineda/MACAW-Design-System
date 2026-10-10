import { Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { focusRing } from '@/components/docs-ui/focus';
import { Swatch } from '@/components/tokens/swatch';
import { cn } from '@/lib/cn';
import { getToken } from '@/lib/tokens';

export function TokensUsed({ names }: { names: string[] }) {
  return (
    <div className="overflow-x-auto rounded-container border border-line-default">
      <table className="w-full border-collapse">
        <thead className="bg-surface-sunken">
          <tr>
            {['Token', 'Light', 'Dark'].map((h) => (
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
          {names.map((name) => {
            const token = getToken(name);
            return (
              <tr key={name}>
                <td className="border-b border-line-subtle px-3 py-2 align-top whitespace-nowrap">
                  <Link
                    href={`/tokens#${name.split('.')[0]}`}
                    className={cn('rounded-xs', focusRing)}
                  >
                    <Text as="span" variant="code">
                      {name}
                    </Text>
                  </Link>
                  {token && (
                    <Text variant="caption" tone="muted">
                      {token.tier} · {token.type}
                    </Text>
                  )}
                </td>
                {(['light', 'dark'] as const).map((theme) => (
                  <td key={theme} className="border-b border-line-subtle px-3 py-2 align-top">
                    {token ? (
                      <div className="flex items-center gap-2">
                        {token.type === 'color' && <Swatch token={token} theme={theme} size="sm" />}
                        <Text as="span" variant="code" tone="secondary">
                          {String(token.value[theme])}
                        </Text>
                      </div>
                    ) : (
                      <Text as="span" variant="caption" tone="muted">
                        not in tokens.json
                      </Text>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
