import { Text } from '@macaw-ds/ui';
import type { ReactNode } from 'react';
import { LevelBadge } from '@/components/component-page/level-badge';
import { StatusBadge } from '@/components/component-page/status-badge';
import { DocsPage } from '@/components/shell/docs-page';
import { blockTabs } from '@/components/shell/nav';
import { blockHref, type BlockLevel } from '@/lib/blocks';
import { loadBlock, type BlockParams } from './load';

/** Shared layout for /templates/<slug> and /pages/<slug>: PageHeader with level, status and tabs. */
export async function BlockLayout({
  level,
  params,
  children,
}: BlockParams & { level: BlockLevel; children: ReactNode }) {
  const block = await loadBlock(level, { params });
  return (
    <DocsPage
      title={block.name}
      description={block.purpose}
      meta={
        <>
          <LevelBadge level={block.level} />
          <StatusBadge status={block.status} />
          <Text as="span" variant="caption" tone="muted">
            @macaw-ds/blocks · since {block.since}
          </Text>
        </>
      }
      tabs={{ label: `${block.name} ${level} sections`, items: blockTabs(blockHref(block)) }}
    >
      {children}
    </DocsPage>
  );
}
