import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { ContrastBadge } from '@/components/tokens/contrast-badge';
import { ContrastMatrix } from '@/components/tokens/contrast-matrix';
import { Code } from '@/components/tokens/sections';
import { Td, TokenTable } from '@/components/tokens/token-table';
import { contrast, getToken, tokensByPrefix } from '@/lib/tokens';

export const metadata: Metadata = { title: 'Accessible colour' };

/** WCAG 1.4.11: lines and the focus ring against the backgrounds they sit on. */
function NonTextContrast() {
  const layers = tokensByPrefix('color.surface.', 'semantic').filter(
    (t) => !t.name.endsWith('inverse') && !t.name.endsWith('-hover'),
  );
  const pairs: [string, string][] = [
    ['color.field.line', 'color.field.bg'],
    ['color.line.strong', 'color.surface.layer-1'],
    ...layers.map((l): [string, string] => ['color.focus.ring', l.name]),
  ];
  return (
    <TokenTable columns={['Line', 'On', 'Light', 'Dark']}>
      {pairs.map(([fgName, bgName]) => {
        const fg = getToken(fgName);
        const bg = getToken(bgName);
        if (!fg || !bg) return null;
        return (
          <tr key={`${fgName}-${bgName}`}>
            <Td nowrap>
              <Text as="span" variant="code">
                {fgName.replace('color.', '')}
              </Text>
            </Td>
            <Td nowrap>
              <Code>{bgName.replace('color.', '')}</Code>
            </Td>
            <Td nowrap>
              <ContrastBadge ratio={contrast(String(fg.value.light), String(bg.value.light))} />
            </Td>
            <Td nowrap>
              <ContrastBadge ratio={contrast(String(fg.value.dark), String(bg.value.dark))} />
            </Td>
          </tr>
        );
      })}
    </TokenTable>
  );
}

export default function AccessibilityColorPage() {
  return (
    <>
      <Section
        id="text"
        title="Text on every layer"
        intro="fg.* on the surface ladder, computed at build time. fg.disabled is exempt from 1.4.3; fg.inverse sits on surface.inverse only."
      >
        <ContrastMatrix />
      </Section>
      <Section
        id="non-text"
        title="Non-text contrast"
        intro="WCAG 1.4.11 asks for 3:1 on the boundaries of controls and on the focus indicator."
      >
        <NonTextContrast />
      </Section>
      <Section id="meaning" title="Colour is never the only signal">
        <Text tone="secondary">
          Status colour reinforces a word: a Badge says &quot;Overdue&quot;, the active SideNav item
          is tinted and carries <Code>aria-current</Code>, and a selected tab changes its text
          colour as well as its underline.
        </Text>
      </Section>
    </>
  );
}
