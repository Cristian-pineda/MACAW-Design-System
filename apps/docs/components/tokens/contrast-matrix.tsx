import { Text } from '@macaw-ds/ui';
import { contrast, tokensByPrefix } from '@/lib/tokens';
import { ContrastBadge } from './contrast-badge';
import { Td, TokenTable } from './token-table';

/** fg.* on every surface layer in both themes, computed at build time from the oklch values in tokens.json. */
export function ContrastMatrix({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  // inverse and on-accent sit on other backgrounds; disabled text is exempt from 1.4.3.
  const fgs = tokensByPrefix('color.fg.', 'semantic').filter(
    (t) => !/\.(inverse|on-accent|disabled)$/.test(t.name),
  );
  // The layer ladder; hover steps sit between two layers and inverse carries fg.inverse only.
  const surfaces = tokensByPrefix('color.surface.', 'semantic').filter(
    (t) => !t.name.endsWith('inverse') && !t.name.endsWith('-hover'),
  );
  return (
    <div className="flex flex-col gap-6">
      {(['light', 'dark'] as const).map((theme) => (
        <div key={theme} className="flex flex-col gap-2">
          <Text as={headingLevel} variant="heading-sm">
            {theme === 'light' ? 'Light' : 'Dark'} theme
          </Text>
          <TokenTable
            columns={[
              'Foreground',
              ...surfaces.map((s) => s.name.replace('color.surface.', 'surface.')),
            ]}
          >
            {fgs.map((fg) => (
              <tr key={fg.name}>
                <Td nowrap>
                  <Text as="span" variant="code">
                    {fg.name.replace('color.', '')}
                  </Text>
                </Td>
                {surfaces.map((bg) => (
                  <Td key={bg.name} nowrap>
                    <ContrastBadge
                      ratio={contrast(String(fg.value[theme]), String(bg.value[theme]))}
                    />
                  </Td>
                ))}
              </tr>
            ))}
          </TokenTable>
        </div>
      ))}
    </div>
  );
}
