import { Text } from '@macaw-ds/ui';
import type { BlockLevel } from '@/lib/blocks';
import { BlockPreview } from './block-preview';
import { loadBlock, type BlockParams } from './load';

export async function BlockPreviewPage({ level, params }: BlockParams & { level: BlockLevel }) {
  const block = await loadBlock(level, { params });
  return (
    <>
      <Text tone="secondary">{block.description}</Text>
      <BlockPreview
        src={`/preview/${block.level}/${block.slug}`}
        title={`${block.name} preview, in an example app`}
      />
      <Text variant="caption" tone="muted">
        The block renders the main area; the preview places it in the real AppShell, TopBar and
        SideNav as its own document, so it keeps its own landmarks and its single h1.
      </Text>
    </>
  );
}
