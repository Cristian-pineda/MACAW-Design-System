import { Badge } from '@macaw-ds/ui';
import { STATUS_TONE } from '@/lib/format';
import type { RegistryStatus } from '@/lib/registry';

export function StatusBadge({
  status,
  size = 'md',
}: {
  status: RegistryStatus;
  size?: 'sm' | 'md';
}) {
  return (
    <Badge tone={STATUS_TONE[status]} size={size}>
      {status}
    </Badge>
  );
}
