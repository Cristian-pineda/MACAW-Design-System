import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { GridDemo } from '@/components/foundations/layout-demos';
import { Code, LayoutTokens } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Layout grid' };

const RECIPE = `<div className="layout-grid gap-y-gutter px-margin py-section">
  <div className="col-span-3">{/* KPI */}</div>
  <div className="col-span-3">{/* KPI */}</div>
  <div className="col-span-3">{/* KPI */}</div>
  <div className="col-span-3">{/* KPI */}</div>
  <div className="col-span-8">{/* chart */}</div>
  <div className="col-span-4">{/* list */}</div>
</div>`;

export default function LayoutGridPage() {
  return (
    <>
      <Text tone="secondary">
        Pages lay out on a 12-column grid (DECISIONS.md #19). <Code>layout-grid</Code> sets the 12
        columns and a column gap equal to the gutter; children take Tailwind <Code>col-span-*</Code>
        . Twelve divides into 2, 3, 4 and 6, which suits KPI rows. The page edge is{' '}
        <Code>px-margin</Code> and sections are separated by <Code>py-section</Code>. Gutter, margin
        and section spacing tighten under the compact density.
      </Text>

      <Section
        id="demo"
        title="The grid, live"
        intro="Rendered with the real utilities; resize the window or switch density in the top bar."
      >
        <GridDemo />
      </Section>

      <Section id="recipe" title="Recipe">
        <CodeBlock code={RECIPE} lang="tsx" copyLabel="Copy grid recipe" />
        <Text variant="body-sm" tone="secondary">
          <Code>layout-grid</Code> sets only the column gap. Add <Code>gap-y-gutter</Code> when
          items wrap onto several rows.
        </Text>
      </Section>

      <Section id="tokens" title="Grid tokens">
        <LayoutTokens
          prefixes={['layout.grid', 'layout.gutter', 'layout.margin', 'layout.section']}
        />
      </Section>

      <Section id="floor" title="The 1024 px floor">
        <Text tone="secondary">
          MACAW is desktop-first with a 1024 px minimum (DECISIONS.md #3). At 1024 px the SideNav
          takes 240 px and the main area keeps 784 px, enough for a 12-column grid with 4-column KPI
          cards. Below the floor, layouts are not designed; do not add breakpoints to rescue them.
          The <Code>md</Code> breakpoint is 1024 px, <Code>lg</Code> 1280 px and <Code>xl</Code>{' '}
          1536 px, for adding columns on wider screens only.
        </Text>
      </Section>
    </>
  );
}
