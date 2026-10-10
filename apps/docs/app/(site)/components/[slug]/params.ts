import { notFound } from 'next/navigation';
import { getComponentSlugs, getManifest } from '@/lib/registry';

export type SlugParams = { params: Promise<{ slug: string }> };

export function componentStaticParams() {
  return getComponentSlugs().map((slug) => ({ slug }));
}

/** Resolves the slug from route params and loads its manifest; unknown slugs 404. */
export async function loadComponent({ params }: SlugParams) {
  const { slug } = await params;
  if (!getComponentSlugs().includes(slug)) notFound();
  return { slug, manifest: await getManifest(slug) };
}
