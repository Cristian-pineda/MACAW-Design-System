import { inferControl } from '@macaw-ds/manifest';
import { Button, Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { A11yPanel } from '@/components/component-page/a11y-panel';
import { DoDont } from '@/components/component-page/do-dont';
import { EjectBox } from '@/components/component-page/eject-box';
import { PropsTable } from '@/components/component-page/props-table';
import { RulesList } from '@/components/component-page/rules-list';
import { Section } from '@/components/component-page/section';
import { StatusBadge } from '@/components/component-page/status-badge';
import { TokensUsed } from '@/components/component-page/tokens-used';
import { Playground, type Control } from '@/components/playground/playground';
import { loadComponentMdx } from '@/lib/content';
import { getComponentSlugs, getManifest } from '@/lib/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const manifest = await getManifest(slug);
  return { title: manifest.name, description: manifest.purpose };
}

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params;
  if (!getComponentSlugs().includes(slug)) notFound();
  const manifest = await getManifest(slug);
  const Mdx = await loadComponentMdx(slug);
  const controls: Record<string, Control> = Object.fromEntries(
    Object.entries(manifest.props).map(([key, spec]) => [key, inferControl(spec)]),
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Text as="h1" variant="display-md">
            {manifest.name}
          </Text>
          <StatusBadge status={manifest.status} />
          <Text as="span" variant="caption" tone="muted">
            {manifest.package} · since {manifest.since} · {manifest.category}
          </Text>
        </div>
        <Text variant="body-lg" tone="secondary">
          {manifest.purpose}
        </Text>
        <Text tone="secondary">{manifest.description}</Text>
        <div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/components/${slug}/gallery`}>Open gallery</Link>
          </Button>
        </div>
      </div>

      <Section
        id="playground"
        title="Playground"
        intro="Controls are generated from the manifest; the snippet is what the CLI prints."
      >
        <Playground slug={slug} manifest={manifest} controls={controls} />
      </Section>

      {Mdx && (
        <article className="flex flex-col gap-4">
          <Mdx />
        </article>
      )}

      <Section id="props" title="Props">
        <PropsTable manifest={manifest} />
      </Section>

      <Section id="do-dont" title="Do and don't">
        <DoDont dos={manifest.dos} donts={manifest.donts} />
      </Section>

      <Section
        id="rules"
        title="Rules"
        intro="Hard rules an agent must follow. The reviewer agent and the lint config check the ones that can be checked."
      >
        <RulesList rules={manifest.rules} />
      </Section>

      <Section id="accessibility" title="Accessibility">
        <A11yPanel a11y={manifest.a11y} />
      </Section>

      <Section
        id="tokens"
        title="Tokens used"
        intro="Every value this component renders comes from one of these tokens."
      >
        <TokensUsed names={manifest.tokens} />
      </Section>

      <Section id="eject" title="Eject">
        <EjectBox slug={slug} budgetGzip={manifest.budget.gzip} />
      </Section>
    </>
  );
}
