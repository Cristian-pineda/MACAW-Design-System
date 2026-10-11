import type { Metadata } from 'next';
import { BlockUsagePage } from '@/components/block-page/block-usage-page';
import { blockStaticParams, loadBlock, type BlockParams } from '@/components/block-page/load';

export const dynamicParams = false;
export const generateStaticParams = blockStaticParams('template');

export async function generateMetadata(props: BlockParams): Promise<Metadata> {
  const block = await loadBlock('template', props);
  return { title: `${block.name} usage`, description: block.purpose };
}

export default function Page(props: BlockParams) {
  return <BlockUsagePage level="template" {...props} />;
}
