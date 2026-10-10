'use client';

import { Button, Text } from '@macaw-ds/ui';
import { useId, useState } from 'react';
import { Switch } from '@/components/docs-ui/switch';

/** A loading Button inside a scope whose data-motion the switch toggles. */
export function ReducedMotionDemo() {
  const [reduced, setReduced] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-stack-md rounded-container border border-line-default bg-surface-layer-1 p-4">
      <div className="flex items-center gap-2">
        <Switch id={id} checked={reduced} onCheckedChange={setReduced} />
        <Text as="label" variant="label-sm" htmlFor={id}>
          data-motion=&quot;reduced&quot; on the frame
        </Text>
      </div>
      <div
        data-motion={reduced ? 'reduced' : undefined}
        data-testid="reduced-motion-frame"
        className="flex items-center gap-inline-sm rounded-control bg-surface-canvas p-6"
      >
        <Button loading>Paying invoice</Button>
        <Button variant="secondary" loading>
          Exporting
        </Button>
      </div>
      <Text variant="caption" tone="muted">
        {reduced
          ? 'Reduced: the spinners stop and the buttons keep their label and aria-busy.'
          : 'Full motion: the spinners rotate with animation.spin (1000 ms, linear).'}
      </Text>
    </div>
  );
}
