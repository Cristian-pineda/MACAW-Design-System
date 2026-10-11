import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parseBlock, type Block } from '@macaw-ds/manifest';
import { BLOCKS_DIR } from './paths';

export type BlockLevel = Block['level'];

/** URL segment per block level: /templates/<slug> and /pages/<slug>. */
export const BLOCK_SEGMENT: Record<BlockLevel, 'templates' | 'pages'> = {
  template: 'templates',
  page: 'pages',
};

let cache: Block[] | null = null;

/** Every block manifest under packages/blocks/src/<slug>/<slug>.block.json, validated, by slug. */
export function getBlocks(): Block[] {
  if (cache) return cache;
  cache = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(BLOCKS_DIR, entry.name, `${entry.name}.block.json`))
    .filter((file) => existsSync(file))
    .map((file) => parseBlock(JSON.parse(readFileSync(file, 'utf8')), path.basename(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return cache;
}

export function getBlocksByLevel(level: BlockLevel): Block[] {
  return getBlocks().filter((block) => block.level === level);
}

export function findBlock(level: BlockLevel, slug: string): Block | undefined {
  return getBlocksByLevel(level).find((block) => block.slug === slug);
}

export function blockHref(block: Pick<Block, 'level' | 'slug'>): string {
  return `/${BLOCK_SEGMENT[block.level]}/${block.slug}`;
}

/** The source a consumer gets from `macaw add <slug>`: packages/blocks/src/<slug>/<slug>.tsx. */
export async function readBlockSource(slug: string): Promise<string> {
  return readFile(path.join(BLOCKS_DIR, slug, `${slug}.tsx`), 'utf8');
}
