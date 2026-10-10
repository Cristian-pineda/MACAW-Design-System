import { Badge } from '@macaw-ds/ui';
import { contrastLevel } from '@/lib/tokens';

const TONE = { AAA: 'success', AA: 'success', 'AA-large': 'warning', fail: 'critical' } as const;

export function ContrastBadge({ ratio }: { ratio: number }) {
  const level = contrastLevel(ratio);
  return (
    <Badge tone={TONE[level]} size="sm" variant={level === 'AAA' ? 'solid' : 'soft'}>
      {ratio.toFixed(2)}:1 {level}
    </Badge>
  );
}
