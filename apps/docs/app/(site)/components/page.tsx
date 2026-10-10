import type { Metadata } from 'next';
import { DocsPage } from '@/components/shell/docs-page';
import { getComponentSummaries } from '@/lib/registry';
import { ComponentsGrid } from './components-grid';

export const metadata: Metadata = { title: 'Components' };

export default function ComponentsPage() {
  const items = getComponentSummaries();
  return (
    <DocsPage
      title="Components"
      description="Every component ships with a manifest: the props, the rules, the accessibility contract and the tokens it uses. This list is generated from those manifests."
    >
      <ComponentsGrid items={items} />
    </DocsPage>
  );
}
