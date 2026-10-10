import { PageHeader } from '@macaw-ds/ui';
import type { ReactNode } from 'react';
import { DocsTabNav } from './docs-tab-nav';
import type { TabLink } from './nav';

export interface DocsPageProps {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  /** One URL per tab; the first is the base URL. */
  tabs?: { label: string; items: TabLink[] };
  children: ReactNode;
}

/** PageHeader (the page's h1, optional tabs) followed by the content column. */
export function DocsPage({ title, description, meta, actions, tabs, children }: DocsPageProps) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        meta={meta}
        actions={actions}
        tabs={tabs ? <DocsTabNav label={tabs.label} tabs={tabs.items} /> : undefined}
      />
      <div className="flex max-w-page flex-col gap-section px-margin py-section">{children}</div>
    </>
  );
}
