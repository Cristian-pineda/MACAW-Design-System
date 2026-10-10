import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { ContainersDemo } from '@/components/foundations/layout-demos';
import { Code, LayoutTokens } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Containers' };

export default function ContainersPage() {
  return (
    <>
      <Text tone="secondary">
        Four named content widths cap a column so lines stay readable and forms stay narrow.
        Tailwind&apos;s default container sizes (<Code>max-w-5xl</Code> and friends) are disabled;
        use these instead. They do not change with density.
      </Text>
      <Section
        id="demo"
        title="The four widths"
        intro="Each bar is capped by its container, and by the main column on narrower screens."
      >
        <ContainersDemo />
      </Section>
      <Section id="tokens" title="Tokens">
        <LayoutTokens prefixes={['layout.container']} />
      </Section>
    </>
  );
}
