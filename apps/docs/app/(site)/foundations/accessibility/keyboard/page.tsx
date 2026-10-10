import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/component-page/section';
import { focusRing } from '@/components/docs-ui/focus';
import { AccessibilityExample } from '@/components/foundations/examples';
import { Code } from '@/components/tokens/sections';
import { Td, TokenTable } from '@/components/tokens/token-table';
import { cn } from '@/lib/cn';
import { getComponentSlugs, getManifest } from '@/lib/registry';

export const metadata: Metadata = { title: 'Keyboard' };

export default async function KeyboardPage() {
  const manifests = await Promise.all(getComponentSlugs().map((slug) => getManifest(slug)));
  return (
    <>
      <Section
        id="focus"
        title="One focus style"
        intro="Every interactive component uses the same 2 px outline at a 2 px offset, at 3:1 against every surface layer, drawn with outline so it survives forced-colours mode."
      >
        <AccessibilityExample />
        <Text variant="body-sm" tone="secondary">
          Previews render each component&apos;s own focus style through the{' '}
          <Code>force-focus:</Code> variant inside a <Code>data-force-focus</Code> scope, never with
          an override, so a broken focus style shows up in the docs and the visual tests.
        </Text>
      </Section>

      <Section
        id="skip"
        title="Skip link and landmarks"
        intro="AppShell renders a skip link as the first Tab stop. Press Tab on this page to see it; Enter moves focus to main."
      >
        <Text tone="secondary">
          Landmarks come from the frame: the TopBar is the banner, the SideNav column is a named
          complementary region, the page is main. SideNav and TabNav are navigation landmarks named
          by their <Code>aria-label</Code>.
        </Text>
      </Section>

      <Section
        id="components"
        title="Keys per component"
        intro="From each manifest's a11y.keyboard list; the keyboard e2e suite tabs through every gallery and page."
      >
        <TokenTable columns={['Component', 'Focusable', 'Keys']}>
          {manifests.map((m) => (
            <tr key={m.slug}>
              <Td nowrap>
                <Link
                  href={`/components/${m.slug}/accessibility`}
                  className={cn(
                    'rounded-xs text-body-sm text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
                    focusRing,
                  )}
                >
                  {m.name}
                </Link>
              </Td>
              <Td nowrap>
                <Text as="span" variant="body-sm">
                  {m.a11y.focusable === true
                    ? 'Yes'
                    : m.a11y.focusable === false
                      ? 'No'
                      : `With ${m.a11y.focusable.whenProp}`}
                </Text>
              </Td>
              <Td>
                {m.a11y.keyboard.length === 0 ? (
                  <Text as="span" variant="caption" tone="muted">
                    None
                  </Text>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                    {m.a11y.keyboard.map((k) => (
                      <li key={k}>
                        <Text as="span" variant="body-sm">
                          {k}
                        </Text>
                      </li>
                    ))}
                  </ul>
                )}
              </Td>
            </tr>
          ))}
        </TokenTable>
      </Section>
    </>
  );
}
