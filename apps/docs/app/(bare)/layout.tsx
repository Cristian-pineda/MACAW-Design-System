import type { ReactNode } from 'react';

/** No site chrome: gallery pages are the target for axe, keyboard and visual tests. */
export default function BareLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
