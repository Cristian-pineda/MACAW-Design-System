import { Icon } from '@macaw-ds/icons';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { LevelBadge } from '@/components/component-page/level-badge';
import { StatusBadge } from '@/components/component-page/status-badge';
import type { Level } from '@macaw-ds/manifest';
import type { RegistryStatus } from '@/lib/registry';

export interface GridItem {
  slug: string;
  title: string;
  purpose: string;
  status: RegistryStatus;
  level: Level | 'page';
  href: string;
  /** Footer caption: the package or "Block". */
  source: string;
}

/** One level's cards: title, level and status, purpose, and where it ships from. */
export function ComponentsGrid({ items }: { items: GridItem[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0">
      {items.map((item) => (
        <li key={item.href}>
          <Card interactive asChild>
            <Link href={item.href}>
              <CardHeader>
                <CardTitle as="h3">{item.title}</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    <LevelBadge level={item.level} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <Text variant="body-sm" tone="secondary">
                    {item.purpose}
                  </Text>
                </div>
              </CardBody>
              <CardFooter>
                <Text as="span" variant="caption" tone="muted">
                  {item.source}
                </Text>
                <Icon name="chevron-right" size="sm" tone="muted" />
              </CardFooter>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
