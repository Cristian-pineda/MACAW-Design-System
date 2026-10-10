import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { DensityDemo } from '@/components/foundations/layout-demos';
import { Code, LayoutTokens } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Density' };

const RECIPE = `<html lang="en" data-density="compact">        {/* the whole product */}
<section data-density="compact">…</section>       {/* one dense region, such as a ledger table */}
<section data-density="comfortable">…</section>   {/* opt back out inside a compact page */}`;

export default function DensityPage() {
  return (
    <>
      <Text tone="secondary">
        Density is a token mode, built like light and dark (DECISIONS.md #18). Set{' '}
        <Code>data-density=&quot;compact&quot;</Code> on <Code>html</Code> or any region and control
        heights, the TopBar, gutters, margins, stack spacing and card padding tighten together. Type
        sizes and badge sizes do not change, and no control goes below the 24 px target size.
        Components read the tokens through utilities, so they adapt without props.
      </Text>

      <Section
        id="demo"
        title="Side by side"
        intro="The same Card, Input and Button composition in a comfortable scope and a compact scope."
      >
        <DensityDemo />
      </Section>

      <Section
        id="tokens"
        title="What changes"
        intro="From the token metadata: every layout and size token, its compact value, and the utility that reads it."
      >
        <LayoutTokens />
      </Section>

      <Section id="when" title="When to use compact">
        <ul className="m-0 flex list-disc flex-col gap-1 pl-5">
          {[
            'Data-dense products used all day by specialists: ledgers, reconciliation, trading and operations consoles.',
            'One dense region inside a comfortable page, such as a long transactions table.',
            'Not for onboarding, settings or anything a person visits rarely; comfortable is the default.',
            'Never as a fix for a layout that does not fit. Change the layout, not the density.',
          ].map((item) => (
            <li key={item} className="text-body-md text-fg-secondary">
              <Text as="span" tone="secondary">
                {item}
              </Text>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="recipe" title="Recipe">
        <CodeBlock code={RECIPE} lang="tsx" copyLabel="Copy density recipe" />
      </Section>
    </>
  );
}
