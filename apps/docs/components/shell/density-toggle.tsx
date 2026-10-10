'use client';

import { useSyncExternalStore } from 'react';
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
    <Segmented
      label="Density"
      options={[
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'compact', label: 'Compact' },
      ]}
      value={density}
      onValueChange={write}
    />
  );
}
