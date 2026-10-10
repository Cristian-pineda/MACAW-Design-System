import type { ReactNode } from 'react';
import { DocsPage } from './docs-page';
import { foundation } from './nav';

/** Shared layout for a foundation: PageHeader with its tabs, then the active tab's content. */
export function FoundationLayout({ slug, children }: { slug: string; children: ReactNode }) {
  const f = foundation(slug);
  return (
    <DocsPage
      title={f.title}
      description={f.description}
      tabs={{ label: `${f.title} sections`, items: f.tabs }}
    >
      {children}
    </DocsPage>
  );
}
