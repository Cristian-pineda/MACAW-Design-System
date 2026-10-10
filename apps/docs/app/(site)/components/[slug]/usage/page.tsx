import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DoDont } from '@/components/component-page/do-dont';
import { RulesList } from '@/components/component-page/rules-list';
import { Section } from '@/components/component-page/section';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { loadComponentMdx } from '@/lib/content';
import { humanize } from '@/lib/format';
import { componentStaticParams, loadComponent, type SlugParams } from '../params';

export const dynamicParams = false;
export const generateStaticParams = componentStaticParams;

export async function generateMetadata(props: SlugParams): Promise<Metadata> {
  const { manifest } = await loadComponent(props);
  return { title: `${manifest.name} usage` };
}

export default async function ComponentUsagePage(props: SlugParams) {
  const { slug, manifest } = await loadComponent(props);
  const Mdx = await loadComponentMdx(slug);

  return (
    <>
      {Mdx ? (
        <article className="flex max-w-prose flex-col gap-stack-md">
          <Mdx />
        </article>
      ) : (
        <Text tone="secondary">{manifest.description}</Text>
      )}

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

      {manifest.related.length > 0 && (
        <Section id="related" title="Related">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {manifest.related.map((r) => (
              <li key={r}>
                <Link
                  href={`/components/${r}`}
                  className={cn(
                    'rounded-xs text-body-md text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
                    focusRing,
                  )}
                >
                  {humanize(r)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
