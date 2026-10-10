import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { ElevationScale, RadiusScale } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Shadows' };

export default function ShadowsPage() {
  return (
    <>
      <Text tone="secondary">
        Shadows are the last resort. Each elevation is a named role with one shadow, so floating UI
        looks the same everywhere and dark mode can soften every shadow in one place.
      </Text>
      <Section id="elevation" title="Elevation roles">
        <ElevationScale />
      </Section>
      <Section
        id="radius"
        title="Radius"
        intro="Radii of 8 px or less (DECISIONS.md #15). Semantic shapes name what each radius is for."
      >
        <RadiusScale />
      </Section>
    </>
  );
}
