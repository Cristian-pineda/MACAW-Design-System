import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { TypographyScale } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Type scale' };

export default function TypographyScalePage() {
  return (
    <>
      <Text tone="secondary">
        Each variant sets size, leading, weight and tracking together through one utility (
        <Text as="span" variant="code">
          text-body-md
        </Text>
        ). Headings tighten tracking; captions widen it. Numeric roles add tabular numerals.
      </Text>
      <TypographyScale />
    </>
  );
}
