import { inferControl } from '@macaw-ds/manifest';
import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { ExampleList } from '@/components/gallery/example-list';
import { Playground, type Control } from '@/components/playground/playground';
import { componentStaticParams, loadComponent, type SlugParams } from './params';

export const dynamicParams = false;
export const generateStaticParams = componentStaticParams;

export async function generateMetadata(props: SlugParams): Promise<Metadata> {
  const { manifest } = await loadComponent(props);
  return { title: manifest.name, description: manifest.purpose };
}

export default async function ComponentOverviewPage(props: SlugParams) {
  const { slug, manifest } = await loadComponent(props);
  const controls: Record<string, Control> = Object.fromEntries(
    Object.entries(manifest.props).map(([key, spec]) => [key, inferControl(spec)]),
  );

  return (
    <>
      <Text tone="secondary">{manifest.description}</Text>
      <Section
        id="playground"
        title="Playground"
        intro="Controls are generated from the manifest; the snippet is what the CLI prints. Show focus and Reduced motion appear only when they apply."
      >
        <Playground slug={slug} manifest={manifest} controls={controls} />
      </Section>
      <Section
        id="examples"
        title="Examples"
        intro="The named exports of the examples file, rendered as they ship."
      >
        <ExampleList slug={slug} prefix="example" />
      </Section>
    </>
  );
}
