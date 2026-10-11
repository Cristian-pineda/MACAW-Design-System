'use client';

import { buildJsxSnippet, previewControls, type Manifest } from '@macaw-ds/manifest';
import { Button, Input, Text } from '@macaw-ds/ui';
import { useTheme } from 'next-themes';
import { useId, useMemo, useState } from 'react';
import { Segmented } from '@/components/docs-ui/segmented';
import { Select } from '@/components/docs-ui/select';
import { Switch } from '@/components/docs-ui/switch';
import { cn } from '@/lib/cn';
import { useMounted } from '@/lib/use-mounted';
import { componentMap, type PlaygroundProps } from './component-map';
import { Snippet } from './snippet';
import { ScrollRegion } from '@/components/docs-ui/scroll-region';

export type Control = 'segmented' | 'select' | 'switch' | 'text' | 'number' | 'none';

export interface PlaygroundProps_ {
  slug: string;
  manifest: Manifest;
  /** Control per prop, inferred on the server with `inferControl` from @macaw-ds/manifest. */
  controls: Record<string, Control>;
}

function defaultsOf(manifest: Manifest): PlaygroundProps {
  const out: PlaygroundProps = {};
  for (const [key, spec] of Object.entries(manifest.props)) {
    if (spec.default !== undefined) out[key] = spec.default;
  }
  return out;
}

type FrameTheme = 'light' | 'dark';

export function Playground({ slug, manifest, controls }: PlaygroundProps_) {
  const entry = componentMap[slug];
  const defaults = useMemo(() => defaultsOf(manifest), [manifest]);
  const [props, setProps] = useState<PlaygroundProps>(defaults);
  const [frameOverride, setFrameOverride] = useState<FrameTheme | null>(null);
  const [showFocus, setShowFocus] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeExample, setActiveExample] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const uid = useId();

  // The frame follows the site theme until the user picks one. The site theme is read only after mount:
  // next-themes knows it during hydration, the server did not, and React does not patch mismatched attributes.
  const frameTheme: FrameTheme =
    frameOverride ?? (mounted && resolvedTheme === 'dark' ? 'dark' : 'light');

  function setProp(key: string, value: unknown) {
    setActiveExample(null);
    setProps((prev) => ({ ...prev, [key]: value }));
  }

  function applyExample(name: string, exampleProps: Record<string, unknown> | undefined) {
    setActiveExample(name);
    setProps({ ...defaults, ...(exampleProps ?? {}) });
  }

  const snippet = useMemo(
    () =>
      entry?.snippet
        ? entry.snippet(props)
        : buildJsxSnippet(manifest, props, {
            children: typeof props.children === 'string' ? props.children : undefined,
          }),
    [entry, manifest, props],
  );
  // Which preview controls can do anything for this component with these props (DECISIONS.md #20).
  const preview = useMemo(() => previewControls(manifest, props), [manifest, props]);
  const forceFocus = preview.focus && showFocus;
  const motionReduced = preview.motion && reducedMotion;

  if (!entry) {
    return (
      <Text tone="critical">
        not-in-system: no playground entry for {slug}. Add it to
        components/playground/component-map.tsx.
      </Text>
    );
  }

  const { Component } = entry;
  const prepared = entry.prepare ? entry.prepare(props) : props;
  const children = prepared.children ?? entry.defaultChildren;
  const element = <Component {...prepared}>{children}</Component>;
  const rendered = entry.wrap ? entry.wrap(element, prepared) : element;

  const controlEntries = Object.entries(manifest.props).filter(
    ([key]) => (controls[key] ?? 'none') !== 'none',
  );

  // Slot-only components (AppShell, TopBar) have nothing to adjust; give the preview the full width.
  const hasControls = controlEntries.length > 0;

  return (
    <div className={hasControls ? 'grid gap-6 lg:grid-cols-3' : 'flex flex-col gap-6'}>
      <div className={cn('flex min-w-0 flex-col gap-4', hasControls && 'lg:col-span-2')}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-container border border-line-default bg-surface-layer-1 px-4 py-3">
          <div className="flex items-center gap-2">
            <Text as="span" variant="label-sm" tone="secondary" id={`${uid}-frame-theme`}>
              Frame theme
            </Text>
            <Segmented
              label="Frame theme"
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              value={frameTheme}
              onValueChange={setFrameOverride}
            />
          </div>
          {preview.focus && (
            <div className="flex items-center gap-2">
              <Switch id={`${uid}-focus`} checked={showFocus} onCheckedChange={setShowFocus} />
              <Text as="label" variant="label-sm" tone="secondary" htmlFor={`${uid}-focus`}>
                Show focus
              </Text>
            </div>
          )}
          {preview.motion && (
            <div className="flex items-center gap-2">
              <Switch
                id={`${uid}-motion`}
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
              <Text as="label" variant="label-sm" tone="secondary" htmlFor={`${uid}-motion`}>
                Reduced motion
              </Text>
            </div>
          )}
          {!hasControls && (
            <Text variant="caption" tone="muted">
              No adjustable props: the content goes in slots.
            </Text>
          )}
          {preview.hints.length > 0 && (
            <Text variant="caption" tone="muted" data-testid="preview-hints">
              {preview.hints.join(' ')}
            </Text>
          )}
          {preview.motion && manifest.motion && (
            <Text variant="caption" tone="muted" data-testid="preview-motion">
              {`What moves: ${manifest.motion.description} `}
              {reducedMotion
                ? 'Reduced motion is on: animations stop and transitions are instant.'
                : manifest.motion.tokens.some((t) => t.startsWith('animation.'))
                  ? ''
                  : 'Hover transitions are 100 ms, so the difference is subtle by design.'}
            </Text>
          )}
        </div>

        <ScrollRegion
          label={`${manifest.name} preview`}
          className="rounded-container border border-line-default"
        >
          <div
            data-theme={frameTheme}
            data-force-focus={forceFocus ? '' : undefined}
            data-motion={motionReduced ? 'reduced' : undefined}
            data-testid="playground-frame"
            className="isolate flex min-h-56 items-center justify-center bg-surface-canvas p-8 text-fg-primary"
          >
            {rendered}
          </div>
        </ScrollRegion>

        {manifest.examples.length > 0 && (
          <div className="flex flex-col gap-2">
            <Text as="span" variant="label-sm" tone="secondary" id={`${uid}-examples`}>
              Examples
            </Text>
            <div role="group" aria-labelledby={`${uid}-examples`} className="flex flex-wrap gap-2">
              {manifest.examples.map((example) => (
                <Button
                  key={example.name}
                  size="sm"
                  variant={activeExample === example.name ? 'primary' : 'secondary'}
                  aria-pressed={activeExample === example.name}
                  onClick={() => applyExample(example.name, example.props)}
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Snippet code={snippet} />
      </div>

      {hasControls && (
        <form
          aria-label="Playground controls"
          className="flex flex-col gap-4 self-start rounded-container border border-line-default bg-surface-layer-1 p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Text variant="heading-sm">Controls</Text>
          {controlEntries.map(([key, spec]) => {
            const control = controls[key] ?? 'none';
            const labelId = `${uid}-${key}-label`;
            const inputId = `${uid}-${key}`;
            const value = props[key];
            return (
              <div key={key} className="flex flex-col gap-1.5">
                {control === 'switch' ? (
                  <div className="flex items-center justify-between gap-3">
                    <Text as="label" variant="label-sm" htmlFor={inputId}>
                      {key}
                    </Text>
                    <Switch
                      id={inputId}
                      checked={Boolean(value)}
                      onCheckedChange={(checked) => setProp(key, checked)}
                    />
                  </div>
                ) : (
                  <>
                    {control === 'segmented' ? (
                      <Text as="span" variant="label-sm" id={labelId}>
                        {key}
                      </Text>
                    ) : (
                      <Text as="label" variant="label-sm" htmlFor={inputId} id={labelId}>
                        {key}
                      </Text>
                    )}
                    {control === 'segmented' && spec.values && (
                      <Segmented
                        labelledBy={labelId}
                        options={spec.values.map((v) => ({ value: v, label: v }))}
                        value={String(value ?? spec.values[0])}
                        onValueChange={(next) => setProp(key, next)}
                      />
                    )}
                    {control === 'select' && spec.values && (
                      <Select
                        id={inputId}
                        labelledBy={labelId}
                        options={spec.values.map((v) => ({ value: v, label: v }))}
                        value={String(value ?? spec.values[0])}
                        onValueChange={(next) => setProp(key, next)}
                      />
                    )}
                    {control === 'text' && (
                      <Input
                        id={inputId}
                        size="sm"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(event) => setProp(key, event.target.value)}
                      />
                    )}
                    {control === 'number' && (
                      <Input
                        id={inputId}
                        size="sm"
                        type="number"
                        align="end"
                        value={typeof value === 'number' ? String(value) : ''}
                        onChange={(event) =>
                          setProp(
                            key,
                            event.target.value === '' ? undefined : Number(event.target.value),
                          )
                        }
                      />
                    )}
                  </>
                )}
                {spec.description && (
                  <Text variant="caption" tone="muted">
                    {spec.description}
                  </Text>
                )}
              </div>
            );
          })}
        </form>
      )}
    </div>
  );
}
