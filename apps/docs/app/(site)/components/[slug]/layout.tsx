import { Button, Text } from '@macaw-ds/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LevelBadge } from '@/components/component-page/level-badge';
import { StatusBadge } from '@/components/component-page/status-badge';
import { DocsPage } from '@/components/shell/docs-page';
import { componentTabs } from '@/components/shell/nav';
import { componentStaticParams, loadComponent, type SlugParams } from './params';

export const dynamicParams = false;
export const generateStaticParams = componentStaticParams;

/** One URL per tab: Overview, Usage, Accessibility, Code. The header and tabs come from the manifest. */
export default async function ComponentLayout({
  children,
  params,
}: SlugParams & { children: ReactNode }) {
  const { slug, manifest } = await loadComponent({ params });
  return (
    <DocsPage
      title={manifest.name}
      description={manifest.purpose}
      meta={
        <>
          <LevelBadge level={manifest.level} />
          <StatusBadge status={manifest.status} />
          <Text as="span" variant="caption" tone="muted">
            {manifest.package} · since {manifest.since}
          </Text>
        </>
      }
      actions={
        <Button asChild variant="secondary" size="sm">
          <Link href={`/components/${slug}/gallery`}>Open gallery</Link>
        </Button>
      }
      tabs={{ label: `${manifest.name} sections`, items: componentTabs(slug) }}
    >
      {children}
    </DocsPage>
  );
}
