'use client';

import { useSyncExternalStore } from 'react';
import { Icon } from '@macaw-ds/icons';
import { Button } from '@macaw-ds/ui';
import { Segmented } from '@/components/docs-ui/segmented';
import { DENSITY_STORAGE_KEY, type Density } from './density';

const EVENT = 'macaw-density-change';

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
  };
}

function read(): Density {
  return document.documentElement.getAttribute('data-density') === 'compact'
    ? 'compact'
    : 'comfortable';
}

function write(next: Density) {
  document.documentElement.setAttribute('data-density', next);
  try {
    window.localStorage.setItem(DENSITY_STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode); the attribute still applies for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Sets data-density on <html> and remembers it. Docs-local (DECISIONS.md #13); the mode itself is tokens (#18). */
export function DensityToggle() {
  const density = useSyncExternalStore(subscribe, read, () => 'comfortable' as Density);
  return (
    <>
      <span className="hidden md:inline-flex">
        <Segmented
          label="Density"
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
          value={density}
          onValueChange={write}
        />
      </span>
      {/* Below the 1024px floor: one toggle button, so the TopBar reflows at 320px (WCAG 1.4.10). */}
      <span className="inline-flex md:hidden">
        <Button
          iconOnly
          variant="ghost"
          aria-label="Compact density"
          aria-pressed={density === 'compact'}
          onClick={() => write(density === 'compact' ? 'comfortable' : 'compact')}
        >
          <Icon name="table" />
        </Button>
      </span>
    </>
  );
}
