import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExampleList, FocusedExample } from '@/components/gallery/example-list';
import { humanize } from '@/lib/format';
import { getComponentSlugs, getManifest } from '@/lib/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return getComponentSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${humanize(slug)} gallery` };
}

/** Every example in light and dark, plus a focused row. No site chrome: this is the axe, keyboard and VRT target. */
export default async function GalleryPage({ params }: Params) {
  const { slug } = await params;
  if (!getComponentSlugs().includes(slug)) notFound();
  const manifest = await getManifest(slug);

  return (
    <main className="flex min-h-dvh flex-col" data-gallery={slug}>
      <section
        data-theme="light"
        aria-labelledby="gallery-light"
        className="flex flex-col gap-6 bg-surface-canvas px-10 py-8 text-fg-primary"
      >
        <div className="flex flex-col gap-1">
          <Text as="h1" variant="heading-lg">
            {manifest.name} gallery
          </Text>
          <Text as="h2" variant="label-sm" tone="muted" id="gallery-light">
            Light
          </Text>
        </div>
        <ExampleList slug={slug} prefix="light" />
      </section>

      <section
        data-theme="dark"
        aria-labelledby="gallery-dark"
        className="flex flex-col gap-6 bg-surface-canvas px-10 py-8 text-fg-primary"
      >
        <Text as="h2" variant="label-sm" tone="muted" id="gallery-dark">
          Dark
        </Text>
        <ExampleList slug={slug} prefix="dark" />
      </section>

      <section
        data-theme="light"
        aria-labelledby="gallery-focused"
        className="flex flex-col gap-6 bg-surface-canvas px-10 py-8 text-fg-primary"
      >
        <Text as="h2" variant="label-sm" tone="muted" id="gallery-focused">
          Focused
        </Text>
        <FocusedExample slug={slug} />
      </section>
    </main>
  );
}
