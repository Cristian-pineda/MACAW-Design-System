import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { SemanticColors } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Semantic colours' };

export default function SemanticColorsPage() {
  return (
    <>
      <Text tone="secondary">
        Every semantic colour token, grouped by role, with its light and dark value. The contrast
        badges are computed at build time from the oklch values against the background the token is
        meant to sit on: text on layer-1, status text on its status background, button text on its
        button.
      </Text>
      <SemanticColors headingLevel="h2" />
    </>
  );
}
