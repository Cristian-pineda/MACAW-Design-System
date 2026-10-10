import { Text } from '@macaw-ds/ui';
import type { ReactNode } from 'react';
import { Section } from '@/components/component-page/section';
import { ContrastBadge } from '@/components/tokens/contrast-badge';
import { Code } from '@/components/tokens/sections';
import { Swatch } from '@/components/tokens/swatch';
import { Td, TokenTable } from '@/components/tokens/token-table';
import { contrast, getToken, SURFACE_LAYERS } from '@/lib/tokens';

const PAIRING = [
  ['App background, the main area behind pages', 'canvas'],
  ['TopBar, SideNav column, PageHeader', 'layer-1'],
  ['Cards, panels, the playground controls', 'layer-1'],
  ['Table header, card footer, code block, inset well', 'layer-2'],
  ['A selected or highlighted region inside a layer-2 well', 'layer-3'],
  ['Menus, popovers, select lists, dialogs', 'overlay + shadow'],
  ['Tooltips, toasts', 'inverse'],
  ['Hovered row or nav item on a layer', 'that layer’s -hover token'],
] as const;

function Rule() {
  return (
    <div className="flex flex-col gap-1 rounded-container border border-status-accent-line bg-status-accent-bg px-4 py-3">
      <Text variant="label-md" tone="accent">
        Tone first, border second, shadow last.
      </Text>
      <Text variant="body-sm">
        Separate regions by stepping the surface tone. Add a 1 px line where two regions of the same
        tone meet. Use a shadow only for UI that floats above the page.
      </Text>
    </div>
  );
}

function Layer({
  token,
  label,
  children,
}: {
  token: 'canvas' | 'layer-1' | 'layer-2' | 'layer-3';
  label: string;
  children?: ReactNode;
}) {
  const bg = {
    canvas: 'bg-surface-canvas',
    'layer-1': 'bg-surface-layer-1 border border-line-default',
    'layer-2': 'bg-surface-layer-2',
    'layer-3': 'bg-surface-layer-3',
  }[token];
  return (
    <div className={`flex flex-col gap-stack-sm rounded-container p-4 ${bg}`}>
      <Text as="span" variant="label-sm" tone="secondary">
        {label}
      </Text>
      {children}
    </div>
  );
}

/** canvas → layer-1 → layer-2 → layer-3, rendered in each theme side by side. */
export function NestedSurfaces() {
  return (
    <div className="layout-grid gap-y-gutter">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="col-span-6 rounded-container border border-line-default text-fg-primary"
        >
          <Layer token="canvas" label={`surface.canvas · ${theme}`}>
            <Layer token="layer-1" label="surface.layer-1">
              <Layer token="layer-2" label="surface.layer-2">
                <Layer token="layer-3" label="surface.layer-3">
                  <Text variant="numeric-md" numeric>
                    $12,480.00
                  </Text>
                </Layer>
              </Layer>
            </Layer>
          </Layer>
        </div>
      ))}
    </div>
  );
}

/** The whole surface story. Shared by Color / Surfaces and Elevation / Surfaces. */
export function SurfacesGuide() {
  const primary = getToken('color.fg.primary');
  return (
    <>
      <Rule />

      <Section
        id="ladder"
        title="The layer ladder"
        intro="Depth reads from tone alone. In light, layer-1 is white on a shaded canvas and nested layers step darker; in dark, every step is lighter. Adjacent layers always differ."
      >
        <TokenTable columns={['Token', 'Light', 'Dark', 'fg.primary (light / dark)', 'Use for']}>
          {SURFACE_LAYERS.map((layer) => {
            const t = getToken(layer.name);
            if (!t) return null;
            return (
              <tr key={layer.name}>
                <Td nowrap>
                  <Text as="span" variant="code">
                    {layer.name.replace('color.', '')}
                  </Text>
                  <Text variant="caption" tone="muted">
                    {layer.utility}
                  </Text>
                </Td>
                {(['light', 'dark'] as const).map((theme) => (
                  <Td key={theme} nowrap>
                    <Swatch token={t} theme={theme} size="md" />
                  </Td>
                ))}
                <Td nowrap>
                  {primary && layer.name !== 'color.surface.inverse' ? (
                    <div className="flex items-center gap-1">
                      <ContrastBadge
                        ratio={contrast(String(primary.value.light), String(t.value.light))}
                      />
                      <ContrastBadge
                        ratio={contrast(String(primary.value.dark), String(t.value.dark))}
                      />
                    </div>
                  ) : (
                    <Text as="span" variant="caption" tone="muted">
                      uses fg.inverse
                    </Text>
                  )}
                </Td>
                <Td>
                  <Text variant="body-sm">{layer.use}</Text>
                </Td>
              </tr>
            );
          })}
        </TokenTable>
      </Section>

      <Section
        id="nested"
        title="Nested, in both themes"
        intro="The same four steps in light and dark. Only the outer card has a border; the inner steps are separated by tone alone."
      >
        <NestedSurfaces />
      </Section>

      <Section id="pairing" title="Which layer for which UI">
        <TokenTable columns={['UI', 'Surface']}>
          {PAIRING.map(([ui, surface]) => (
            <tr key={ui}>
              <Td>
                <Text variant="body-sm">{ui}</Text>
              </Td>
              <Td nowrap>
                <Code>{surface}</Code>
              </Td>
            </tr>
          ))}
        </TokenTable>
      </Section>

      <Section
        id="hover"
        title="Hover tokens"
        intro="Each layer has a -hover step for rows and items that respond to the pointer. Hover is one step toward the next layer, never a border or a shadow."
      >
        <TokenTable columns={['Layer', 'Hover token', 'Light', 'Dark']}>
          {SURFACE_LAYERS.filter((l) => 'hover' in l).map((layer) => {
            const hover = 'hover' in layer ? getToken(layer.hover) : undefined;
            if (!hover) return null;
            return (
              <tr key={hover.name}>
                <Td nowrap>
                  <Code>{layer.name.replace('color.', '')}</Code>
                </Td>
                <Td nowrap>
                  <Text as="span" variant="code">
                    {hover.name.replace('color.', '')}
                  </Text>
                </Td>
                {(['light', 'dark'] as const).map((theme) => (
                  <Td key={theme} nowrap>
                    <Swatch token={hover} theme={theme} size="sm" />
                  </Td>
                ))}
              </tr>
            );
          })}
        </TokenTable>
      </Section>
    </>
  );
}
