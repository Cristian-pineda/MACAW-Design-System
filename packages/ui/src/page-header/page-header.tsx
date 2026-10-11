import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import type { NativeProps } from '../lib/types.ts';
import { Text, type TextElement } from '../text/text.tsx';

export interface PageHeaderProps extends Omit<NativeProps<'div'>, 'title'> {
  /** The page title. */
  title: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** Small context next to the title: a status Badge, a version, an ID. */
  meta?: React.ReactNode;
  /** Page-level actions, right aligned: the page's one primary Button and its secondaries. */
  actions?: React.ReactNode;
  /** A TabNav for the page's sections. Sticks below the TopBar while the page scrolls. */
  tabs?: React.ReactNode;
  /** Heading element for the title. h1 unless the page already has one. */
  headingLevel?: Extract<TextElement, 'h1' | 'h2'>;
}

/**
 * The page's own header, under the TopBar: title, description, meta, actions and section tabs.
 * Compact by design. The tab row is rendered as a sibling so it can stick for the whole page.
 */
export function PageHeader({
  title,
  description,
  meta,
  actions,
  tabs,
  headingLevel = 'h1',
  ...rest
}: PageHeaderProps) {
  return (
    <>
      <div
        className={cn(
          'border-line-default bg-surface-layer-1 px-margin pt-stack-lg',
          tabs ? 'pb-stack-sm' : 'border-b pb-stack-lg',
        )}
        {...rest}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Text as={headingLevel} variant="heading-lg">
                {title}
              </Text>
              {meta}
            </div>
            {description && (
              <Text variant="body-md" tone="secondary">
                {description}
              </Text>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
      {tabs && (
        <div
          className="z-sticky border-b border-line-default bg-surface-layer-1 px-margin md:sticky md:top-topbar"
          data-page-header-tabs=""
        >
          {tabs}
        </div>
      )}
    </>
  );
}
