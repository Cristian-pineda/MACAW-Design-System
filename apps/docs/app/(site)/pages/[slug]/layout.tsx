import type { ReactNode } from 'react';
import { BlockLayout } from '@/components/block-page/block-layout';
import { blockStaticParams, type BlockParams } from '@/components/block-page/load';

export const dynamicParams = false;
export const generateStaticParams = blockStaticParams('page');

/** One URL per tab: Preview, Code, Usage. The header and tabs come from the block manifest. */
export default function Layout({ params, children }: BlockParams & { children: ReactNode }) {
  return (
    <BlockLayout level="page" params={params}>
      {children}
    </BlockLayout>
  );
}
