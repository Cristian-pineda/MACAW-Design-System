import { createElement, type ComponentType, type ReactElement } from 'react';
import * as blocks from '@macaw-ds/blocks';
import { notFound } from 'next/navigation';
import { findBlock, getBlocksByLevel, type BlockLevel } from '@/lib/blocks';

export type BlockParams = { params: Promise<{ slug: string }> };

export function blockStaticParams(level: BlockLevel) {
  return () => getBlocksByLevel(level).map((block) => ({ slug: block.slug }));
}

/** Resolves the slug for a level; unknown slugs 404. */
export async function loadBlock(level: BlockLevel, { params }: BlockParams) {
  const { slug } = await params;
  const block = findBlock(level, slug);
  if (!block) notFound();
  return block;
}

/** Renders the block's main export (the first name in its manifest's `exports`) with its defaults. */
export function renderBlock(block: { exports: string[] }): ReactElement {
  const name = block.exports[0] ?? '';
  const Component = (blocks as Record<string, unknown>)[name];
  if (typeof Component !== 'function') {
    throw new Error(`@macaw-ds/blocks does not export "${name}"`);
  }
  return createElement(Component as ComponentType);
}
