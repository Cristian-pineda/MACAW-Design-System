import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { ContrastMatrix } from '@/components/tokens/contrast-matrix';
import { Code } from '@/components/tokens/sections';

export const metadata: Metadata = { title: 'Color accessibility' };

export default function ColorAccessibilityPage() {
  return (
    <>
      <Text tone="secondary">
        Every text colour on every surface layer, in both themes, computed at build time from the
        token values. <Code>fg.primary</Code> and <Code>fg.numeric</Code> meet 7:1 (AAA);{' '}
        <Code>fg.secondary</Code> and <Code>fg.muted</Code> meet 4.5:1 (AA).{' '}
        <Code>fg.disabled</Code> is omitted because disabled text is exempt from WCAG 1.4.3, and{' '}
        <Code>fg.inverse</Code> sits on <Code>surface.inverse</Code> only. Hover steps sit between
        two layers and are covered by them.
      </Text>
      <ContrastMatrix headingLevel="h2" />
    </>
  );
}
