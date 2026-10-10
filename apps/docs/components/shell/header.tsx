import { Icon } from '@macaw-ds/icons';
import { Button, Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { GITHUB_URL, SITE_NAME } from '@/lib/site';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-sticky flex h-14 shrink-0 items-center justify-between border-b border-line-default bg-surface-default px-6">
      <Link href="/" className={cn('inline-flex items-center gap-2 rounded-sm', focusRing)}>
        <span aria-hidden="true" className="inline-block size-3 rounded-xs bg-action-primary" />
        <Text as="span" variant="heading-md">
          {SITE_NAME}
        </Text>
        <Text as="span" variant="caption" tone="muted">
          Design system
        </Text>
      </Link>
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="sm" iconEnd={<Icon name="external-link" />}>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
