import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { LayoutTokens, SpaceScale } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Spacing scale' };

export default function SpacingScalePage() {
  return (
    <>
      <Section
        id="primitive"
        title="Primitive scale"
        intro="The 4 px steps behind every spacing utility. These do not change with density."
      >
        <SpaceScale />
      </Section>
      <Section
        id="semantic"
        title="Semantic distances"
        intro='Named distances that components and layouts use. The compact column is the value under data-density="compact".'
      >
        <LayoutTokens
          prefixes={[
            'layout.stack',
            'layout.inline',
            'layout.card',
            'layout.gutter',
            'layout.margin',
            'layout.section',
          ]}
        />
      </Section>
    </>
  );
}
