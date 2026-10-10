import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Code, ZIndexTable } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Z-index' };

export default function ZIndexPage() {
  return (
    <>
      <Text tone="secondary">
        Stacking order is a named scale, never a raw number. The TopBar and the PageHeader tab row
        share <Code>z-sticky</Code>; everything that floats sits above them, so a menu opened from a
        sticky row is never clipped.
      </Text>
      <ZIndexTable />
    </>
  );
}
