'use client';

import { Button, Text } from '@macaw-ds/ui';
import { useState } from 'react';
import type { TokenEntry } from '@/lib/tokens';

/** Moves one bar per duration token so the four speeds can be compared side by side. */
export function MotionDemo({ durations }: { durations: TokenEntry[] }) {
  const [moved, setMoved] = useState(false);
  return (
    <div className="flex flex-col gap-4 rounded-container border border-line-default bg-surface-default p-4">
      <div className="flex items-center justify-between gap-4">
        <Text variant="body-sm" tone="secondary">
          Each bar moves with its own duration and the standard easing. Reduced motion collapses all
          of them to 0 ms.
        </Text>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setMoved((m) => !m)}
          aria-pressed={moved}
        >
          {moved ? 'Reset' : 'Play'}
        </Button>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {durations.map((d) => (
          <li key={d.name} className="grid grid-cols-4 items-center gap-3">
            <Text as="span" variant="code" tone="secondary">
              {d.name}
            </Text>
            <div className="col-span-3 rounded-sm bg-surface-sunken p-1">
              <div
                className={`h-4 w-1/3 rounded-xs bg-action-primary transition-transform ease-standard motion-reduce:transition-none ${moved ? 'translate-x-full' : 'translate-x-0'}`}
                style={{ transitionDuration: `var(${d.cssVar})` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
