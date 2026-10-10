import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { MotionExample } from '@/components/foundations/examples';
import { MotionTokens } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Motion tokens' };

export default function MotionTokensPage() {
  return (
    <>
      <Section id="compare" title="Durations compared">
        <MotionExample />
      </Section>
      <Section
        id="tokens"
        title="Tokens"
        intro='The reduced column is the value under the OS preference or inside data-motion="reduced".'
      >
        <MotionTokens />
      </Section>
    </>
  );
}
