'use client';

import { Text } from '@macaw-ds/ui';
import { useTheme } from 'next-themes';
import { useId, useState, useSyncExternalStore } from 'react';
import { Segmented } from '@/components/docs-ui/segmented';
import { useMounted } from '@/lib/use-mounted';

type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact';

// The site density lives on <html> (components/shell/density-toggle.tsx); follow it until overridden.
const DENSITY_EVENT = 'macaw-density-change';
function subscribeDensity(onChange: () => void) {
  window.addEventListener(DENSITY_EVENT, onChange);
  return () => window.removeEventListener(DENSITY_EVENT, onChange);
}
function readDensity(): Density {
  return document.documentElement.getAttribute('data-density') === 'compact'
    ? 'compact'
    : 'comfortable';
}

/**
 * A template or page in the real AppShell, rendered as its own document in a titled iframe so it
 * keeps its own landmarks and single h1. Light/Dark and Comfortable/Compact pass through the URL.
 */
export function BlockPreview({ src, title }: { src: string; title: string }) {
  const uid = useId();
  const mounted = useMounted();
  const { resolvedTheme } = useTheme();
  const siteDensity = useSyncExternalStore<Density>(
    subscribeDensity,
    readDensity,
    () => 'comfortable',
  );
  const [themeOverride, setThemeOverride] = useState<Theme | null>(null);
  const [densityOverride, setDensityOverride] = useState<Density | null>(null);
  const theme: Theme = themeOverride ?? (mounted && resolvedTheme === 'dark' ? 'dark' : 'light');
  const density: Density = densityOverride ?? siteDensity;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-container border border-line-default bg-surface-layer-1 px-4 py-3">
        <div className="flex items-center gap-2">
          <Text as="span" variant="label-sm" tone="secondary" id={`${uid}-theme`}>
            Frame theme
          </Text>
          <Segmented
            labelledBy={`${uid}-theme`}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            value={theme}
            onValueChange={setThemeOverride}
          />
        </div>
        <div className="flex items-center gap-2">
          <Text as="span" variant="label-sm" tone="secondary" id={`${uid}-density`}>
            Frame density
          </Text>
          <Segmented
            labelledBy={`${uid}-density`}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
            value={density}
            onValueChange={setDensityOverride}
          />
        </div>
      </div>
      <div
        data-testid="block-frame"
        className="overflow-hidden rounded-container border border-line-default bg-surface-canvas"
      >
        <iframe
          key={`${theme}-${density}`}
          title={title}
          src={`${src}?theme=${theme}&density=${density}`}
          className="block h-200 w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
