'use client';

import { Icon } from '@macaw-ds/icons';
import { Card, Text } from '@macaw-ds/ui';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { StatusBadge } from '@/components/component-page/status-badge';
import { Segmented } from '@/components/docs-ui/segmented';
import type { ComponentSummary } from '@/lib/registry';

export function ComponentsGrid({ items }: { items: ComponentSummary[] }) {
  const categories = useMemo(() => ['all', ...new Set(items.map((i) => i.category))], [items]);
  const [category, setCategory] = useState('all');
  const visible = category === 'all' ? items : items.filter((i) => i.category === category);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Filter by category"
          size="md"
          options={categories.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
          value={category}
          onValueChange={setCategory}
        />
        <Text variant="caption" tone="muted" role="status">
          {visible.length} of {items.length} components
        </Text>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.slug}>
            <Card interactive asChild>
              <Link href={`/components/${item.slug}`}>
                <Card.Header>
                  <Card.Title as="h2">{item.title}</Card.Title>
                  <StatusBadge status={item.status} size="sm" />
                </Card.Header>
                <Card.Body>
                  <Text variant="body-sm" tone="secondary">
                    {item.purpose}
                  </Text>
                </Card.Body>
                <Card.Footer>
                  <Text as="span" variant="caption" tone="muted">
                    {item.category}
                  </Text>
                  <Icon name="chevron-right" size="sm" tone="muted" />
                </Card.Footer>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
