import type { ReactNode } from 'react';
import { FoundationLayout } from '@/components/shell/foundation-layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <FoundationLayout slug="color">{children}</FoundationLayout>;
}
