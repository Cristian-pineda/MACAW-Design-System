import { Icon } from '@macaw-ds/icons';
import type { Block } from '@macaw-ds/manifest';
import Link from 'next/link';
import { focusRing } from '@/components/docs-ui/focus';
import { blockHref } from '@/lib/blocks';
import { cn } from '@/lib/cn';
import { renderBlock } from './load';

/**
 * A live, half-scale render of a block (the real component at max-w-page width) with a link to its
 * page. The render is inert: it is a picture of the block, so it takes no focus and stays out of
 * the accessibility tree; the link below it is the way in.
 */
export function BlockThumbnail({ block }: { block: Block }) {
  return (
    <div className="flex flex-col gap-stack-sm">
      <div className="h-72 w-160 max-w-full overflow-hidden rounded-container border border-line-default bg-surface-canvas">
        <div inert className="w-page origin-top-left scale-50 bg-surface-canvas text-fg-primary">
          {renderBlock(block)}
        </div>
      </div>
      <Link
        href={blockHref(block)}
        className={cn(
          'inline-flex w-fit items-center gap-1 rounded-xs text-body-md text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
          focusRing,
        )}
      >
        Open the {block.name.toLowerCase()} {block.level}
        <Icon name="arrow-right" size="sm" />
      </Link>
    </div>
  );
}
