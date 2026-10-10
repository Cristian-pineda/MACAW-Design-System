import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { ColorRamps } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Color palette' };

export default function ColorPalettePage() {
  return (
    <>
      <Text tone="secondary">
        The primitive tier: oklch ramps from 0 (lightest) to 1000 (darkest). The neutral ramp is
        cool grey at hue 250; the accent ramp is a restrained blue-violet; status ramps share
        identical lightness steps so a given step behaves the same in every hue. Primitives are not
        themed and components never reference them; hover a step for its value.
      </Text>
      <ColorRamps headingLevel="h2" />
    </>
  );
}
