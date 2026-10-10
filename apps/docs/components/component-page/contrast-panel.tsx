import { Text } from '@macaw-ds/ui';
import { ContrastBadge } from '@/components/tokens/contrast-badge';
import { Td, TokenTable } from '@/components/tokens/token-table';
import { contrast, getToken, pairFor } from '@/lib/tokens';

/** Contrast for every colour token the component uses that has a defined background pairing. */
export function ContrastPanel({ tokens }: { tokens: string[] }) {
  const rows = tokens
    .map((name) => {
      const fg = getToken(name);
      const pair = pairFor(name);
      const bg = pair ? getToken(pair) : undefined;
      return fg && bg && fg.type === 'color' ? { fg, bg } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return (
      <Text tone="secondary">
        None of this component&apos;s colour tokens is a text or line colour with a fixed
        background; see the contrast matrix in Foundations, Accessibility.
      </Text>
    );
  }

  return (
    <TokenTable columns={['Token', 'On', 'Light', 'Dark']}>
      {rows.map(({ fg, bg }) => (
        <tr key={fg.name}>
          <Td nowrap>
            <Text as="span" variant="code">
              {fg.name.replace('color.', '')}
            </Text>
          </Td>
          <Td nowrap>
            <Text as="span" variant="code" tone="secondary">
              {bg.name.replace('color.', '')}
            </Text>
          </Td>
          <Td nowrap>
            <ContrastBadge ratio={contrast(String(fg.value.light), String(bg.value.light))} />
          </Td>
          <Td nowrap>
            <ContrastBadge ratio={contrast(String(fg.value.dark), String(bg.value.dark))} />
          </Td>
        </tr>
      ))}
    </TokenTable>
  );
}
