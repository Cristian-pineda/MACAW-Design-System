import type { Metadata } from 'next';
import { A11yPanel } from '@/components/component-page/a11y-panel';
import { ContrastPanel } from '@/components/component-page/contrast-panel';
import { MotionPanel } from '@/components/component-page/motion-panel';
import { Section } from '@/components/component-page/section';
import { componentStaticParams, loadComponent, type SlugParams } from '../params';

export const dynamicParams = false;
export const generateStaticParams = componentStaticParams;

export async function generateMetadata(props: SlugParams): Promise<Metadata> {
  const { manifest } = await loadComponent(props);
  return { title: `${manifest.name} accessibility` };
}

export default async function ComponentAccessibilityPage(props: SlugParams) {
  const { manifest } = await loadComponent(props);
  return (
    <>
      <Section
        id="contract"
        title="Contract"
        intro="From the manifest's a11y block: what assistive technology sees, and every key the component handles."
      >
        <A11yPanel a11y={manifest.a11y} />
      </Section>
      <Section id="motion" title="Motion">
        <MotionPanel motion={manifest.motion} />
      </Section>
      <Section
        id="contrast"
        title="Contrast"
        intro="Computed at build time from the token values, against the background each colour is paired with."
      >
        <ContrastPanel tokens={manifest.tokens} />
      </Section>
    </>
  );
}
