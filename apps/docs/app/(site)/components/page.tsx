import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { getComponentSummaries } from '@/lib/registry';
import { ComponentsGrid } from './components-grid';

export const metadata: Metadata = { title: 'Components' };

export default function ComponentsPage() {
  const items = getComponentSummaries();
  return (
    <>
      <div className="flex flex-col gap-2">
        <Text as="h1" variant="display-md">
          Components
        </Text>
        <Text variant="body-lg" tone="secondary">
          Every component ships with a manifest: the props, the rules, the accessibility contract
          and the tokens it uses. The registry below is generated from those manifests.
        </Text>
      </div>
      <ComponentsGrid items={items} />
    </>
  );
}
