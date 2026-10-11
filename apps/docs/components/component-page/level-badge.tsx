import type { Level } from '@macaw-ds/manifest';
import { Badge } from '@macaw-ds/ui';
import { LEVEL_LABEL } from '@/lib/registry';

/** The atomic design level of a component or block: Atom, Molecule, Organism, Template, Page. */
export function LevelBadge({ level, size = 'md' }: { level: Level | 'page'; size?: 'sm' | 'md' }) {
  return (
    <Badge tone="accent" variant="outline" size={size}>
      {LEVEL_LABEL[level].one}
    </Badge>
  );
}
