'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

/** Applies ?theme= and ?density= from the embedding frame to the whole preview document. */
export function PreviewScope({ children }: { children: ReactNode }) {
  const search = useSearchParams();
  const theme = search.get('theme') === 'dark' ? 'dark' : 'light';
  const density = search.get('density') === 'compact' ? 'compact' : 'comfortable';
  return (
    <div
      data-theme={theme}
      data-density={density}
      data-motion={search.get('motion') === 'reduced' ? 'reduced' : undefined}
    >
      {children}
    </div>
  );
}
