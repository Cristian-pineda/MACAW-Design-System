import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Section } from '@/components/component-page/section';
import { focusRing } from '@/components/docs-ui/focus';
import { DocsPage } from '@/components/shell/docs-page';
import { MotionDemo } from '@/components/tokens/motion-demo';
import {
  Code,
  ColorRamps,
  ElevationScale,
  LayoutTokens,
  MotionTokens,
  RadiusScale,
  SemanticColors,
  SpaceScale,
  TypographyScale,
  ZIndexTable,
} from '@/components/tokens/sections';
import { cn } from '@/lib/cn';
import { getTokensVersion, tokensByPrefix } from '@/lib/tokens';

export const metadata: Metadata = { title: 'Tokens' };

const linkClass = cn(
  'rounded-xs text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
  focusRing,
);

export default function TokensPage() {
  return (
    <DocsPage
      title="Tokens"
      description={`The full reference, generated from packages/tokens/src. Version ${getTokensVersion()}.`}
    >
      <Text tone="secondary">
        Three tiers: primitive (<Code>color.neutral.600</Code>), semantic (
        <Code>color.action.primary</Code>), component (<Code>button.height.md</Code>). Components
        reference semantic tokens only. Three modes apply on any element: <Code>data-theme</Code>,{' '}
        <Code>data-density</Code> and <Code>data-motion</Code>. The{' '}
        <Link href="/foundations/color" className={linkClass}>
          foundations
        </Link>{' '}
        explain when to use each token.
      </Text>

      <Section
        id="color"
        title="Colour ramps"
        intro="The primitive tier. Status ramps share identical lightness steps; the neutral ramp is cool grey."
      >
        <ColorRamps />
      </Section>

      <Section
        id="semantic"
        title="Semantic colours"
        intro="The tier components use. Surfaces are a layer ladder: canvas, layer-1, layer-2, layer-3, each with a hover token. Contrast is computed from the oklch values against the background each token is paired with."
      >
        <SemanticColors />
      </Section>

      <Section
        id="typography"
        title="Typography"
        intro="Fifteen named roles. Every string on screen uses one through <Text>; numeric roles set tabular numerals and the 7:1 numeric colour. Type does not change with density."
      >
        <TypographyScale />
      </Section>

      <Section
        id="space"
        title="Space"
        intro="A 4 px scale. Tailwind's spacing utilities (p-4, gap-2) map to it."
      >
        <SpaceScale />
      </Section>

      <Section
        id="layout"
        title="Layout and size"
        intro='Semantic distances and control sizes. The compact column is the value under data-density="compact"; everything else stays the same.'
      >
        <LayoutTokens />
      </Section>

      <Section
        id="radius"
        title="Radius"
        intro="Radii of 8 px or less (DECISIONS.md #15). Semantic shapes name what each radius is for."
      >
        <RadiusScale />
      </Section>

      <Section
        id="elevation"
        title="Elevation"
        intro="Tone first, border second, shadow last. Four named roles."
      >
        <ElevationScale />
      </Section>

      <Section id="z-index" title="Z-index" intro="Named layers; never a raw z-index.">
        <ZIndexTable />
      </Section>

      <Section
        id="motion"
        title="Motion"
        intro="Durations, easings and the one named animation. Reduced motion is honoured at the token layer, so components never branch on it."
      >
        <MotionDemo
          durations={tokensByPrefix('duration.', 'primitive').filter(
            (t) => t.name !== 'duration.spin',
          )}
        />
        <MotionTokens />
      </Section>
    </DocsPage>
  );
}
