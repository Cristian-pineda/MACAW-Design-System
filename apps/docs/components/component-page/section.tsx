import { Text } from '@macaw-ds/ui';
import type { ReactNode } from 'react';

export function Section({
  id,
  title,
  children,
  intro,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="flex scroll-mt-28 flex-col gap-stack-md">
      <div className="flex flex-col gap-1">
        <Text as="h2" variant="heading-lg" id={`${id}-title`}>
          {title}
        </Text>
        {intro && <Text tone="secondary">{intro}</Text>}
      </div>
      {children}
    </section>
  );
}
