import type { Metadata } from 'next';
import { BlockCodePage } from '@/components/block-page/block-code-page';
import { blockStaticParams, loadBlock, type BlockParams } from '@/components/block-page/load';

export const dynamicParams = false;
export const generateStaticParams = blockStaticParams('page');

export async function generateMetadata(props: BlockParams): Promise<Metadata> {
  const block = await loadBlock('page', props);
  return { title: `${block.name} code`, description: block.purpose };
}

export default function Page(props: BlockParams) {
  return <BlockCodePage level="page" {...props} />;
}
