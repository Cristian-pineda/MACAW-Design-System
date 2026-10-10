import { Text } from '@macaw-ds/ui';
import {
  contrast,
  getColorRamps,
  getSemanticColorGroups,
  getToken,
  getTypographyVariant,
  pairFor,
  SEMANTIC_GROUP_ORDER,
  TEXT_VARIANTS,
  tokensByPrefix,
  utilityFor,
  type TextVariant,
} from '@/lib/tokens';
import { ContrastBadge } from './contrast-badge';
import { Swatch } from './swatch';
import { Td, TokenTable } from './token-table';

export function Code({ children }: { children: string }) {
  return (
    <Text as="span" variant="code" tone="secondary">
      {children}
    </Text>
  );
}

function TokenName({ children }: { children: string }) {
  return (
    <Text as="span" variant="code">
      {children}
    </Text>
  );
}

/** Primitive colour ramps. Primitives are not themed; components never reference them. */
export function ColorRamps({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  return (
    <div className="flex flex-col gap-stack-md">
      {getColorRamps().map(({ ramp, steps }) => (
        <div key={ramp} className="flex flex-col gap-1">
          <Text as={headingLevel} variant="label-md">
            {ramp}
          </Text>
          <ul className="m-0 flex list-none gap-1 p-0">
            {steps.map((t) => (
              <li key={t.name} className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  aria-hidden="true"
                  className="block h-10 rounded-xs border border-line-subtle"
                  style={{ backgroundColor: `var(${t.cssVar})` }}
                />
                <Text
                  as="span"
                  variant="caption"
                  tone="muted"
                  title={`${t.name}: ${t.value.light}`}
                >
                  {t.path[2]}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Every semantic colour token, grouped, with light and dark swatches and contrast against its pairing. */
export function SemanticColors({
  groups,
  headingLevel = 'h3',
}: {
  groups?: readonly string[];
  headingLevel?: 'h2' | 'h3';
}) {
  const all = getSemanticColorGroups();
  const order = groups ?? SEMANTIC_GROUP_ORDER;
  const list = order
    .map((g) => all.find((entry) => entry.group === g))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);
  return (
    <div className="flex flex-col gap-section">
      {list.map(({ group, tokens }) => (
        <div key={group} className="flex flex-col gap-stack-sm">
          <Text as={headingLevel} variant="heading-sm" id={`semantic-${group}`}>
            {group}
          </Text>
          <TokenTable columns={['Token', 'Light', 'Dark', 'Contrast (light / dark)']}>
            {tokens.map((t) => {
              const pair = pairFor(t.name);
              const bg = pair ? getToken(pair) : undefined;
              return (
                <tr key={t.name}>
                  <Td nowrap>
                    <TokenName>{t.name.replace('color.', '')}</TokenName>
                  </Td>
                  {(['light', 'dark'] as const).map((theme) => (
                    <Td key={theme} nowrap>
                      <div className="flex items-center gap-2">
                        <Swatch token={t} theme={theme} size="sm" />
                        <Code>{String(t.value[theme])}</Code>
                      </div>
                    </Td>
                  ))}
                  <Td nowrap>
                    {bg ? (
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-1">
                          <ContrastBadge
                            ratio={contrast(String(t.value.light), String(bg.value.light))}
                          />
                          <ContrastBadge
                            ratio={contrast(String(t.value.dark), String(bg.value.dark))}
                          />
                        </div>
                        <Text as="span" variant="caption" tone="muted">
                          on {bg.name.replace('color.', '')}
                        </Text>
                      </div>
                    ) : (
                      <Text as="span" variant="caption" tone="muted">
                        —
                      </Text>
                    )}
                  </Td>
                </tr>
              );
            })}
          </TokenTable>
        </div>
      ))}
    </div>
  );
}

function SampleText({ variant }: { variant: TextVariant }) {
  if (variant.startsWith('numeric')) {
    return (
      <Text variant={variant} numeric>
        $12,480.00
      </Text>
    );
  }
  if (variant === 'code') return <Text variant="code">txn_1Nv2hZ · acct_4421</Text>;
  return <Text variant={variant}>The quick brown fox settles the invoice</Text>;
}

/** The fifteen text roles with live samples. */
export function TypographyScale() {
  return (
    <TokenTable columns={['Variant', 'Sample', 'Size / leading', 'Weight / tracking']}>
      {TEXT_VARIANTS.map((variant) => {
        const t = getTypographyVariant(variant);
        return (
          <tr key={variant}>
            <Td nowrap>
              <TokenName>{variant}</TokenName>
            </Td>
            <Td>
              <SampleText variant={variant} />
            </Td>
            <Td nowrap>
              <Code>{`${t.size?.value.light ?? '—'} / ${t.leading?.value.light ?? '—'}`}</Code>
            </Td>
            <Td nowrap>
              <Code>{`${t.weight?.value.light ?? '—'} / ${t.tracking?.value.light ?? '—'}`}</Code>
            </Td>
          </tr>
        );
      })}
    </TokenTable>
  );
}

/** The primitive 4 px scale with a bar per step. */
export function SpaceScale() {
  return (
    <TokenTable columns={['Token', 'Value', 'Utility', 'Scale']}>
      {tokensByPrefix('space.', 'primitive').map((t) => (
        <tr key={t.name}>
          <Td nowrap>
            <TokenName>{t.name}</TokenName>
          </Td>
          <Td nowrap>
            <Code>{String(t.value.light)}</Code>
          </Td>
          <Td nowrap>
            <Code>{`p-${t.name.replace('space.', '').replace('-', '.')}`}</Code>
          </Td>
          <td className="w-full border-b border-line-subtle px-3 py-2 align-middle">
            <span
              aria-hidden="true"
              className="block h-3 rounded-xs bg-action-primary"
              style={{ width: `var(${t.cssVar})` }}
            />
          </td>
        </tr>
      ))}
    </TokenTable>
  );
}

/** Semantic layout and size tokens with their comfortable and compact values (DECISIONS.md #18). */
export function LayoutTokens({ prefixes = ['size.', 'layout.'] }: { prefixes?: string[] }) {
  const tokens = prefixes.flatMap((p) => tokensByPrefix(p, 'semantic'));
  return (
    <TokenTable columns={['Token', 'Comfortable', 'Compact', 'Utility']}>
      {tokens.map((t) => (
        <tr key={t.name}>
          <Td nowrap>
            <TokenName>{t.name}</TokenName>
            {t.description && (
              <Text variant="caption" tone="muted">
                {t.description}
              </Text>
            )}
          </Td>
          <Td nowrap>
            <Code>{String(t.value.light)}</Code>
          </Td>
          <Td nowrap>
            {t.compact !== undefined ? (
              <Text as="span" variant="code">
                {String(t.compact)}
              </Text>
            ) : (
              <Text as="span" variant="caption" tone="muted">
                same
              </Text>
            )}
          </Td>
          <Td nowrap>
            <Code>{utilityFor(t.name)}</Code>
          </Td>
        </tr>
      ))}
    </TokenTable>
  );
}

export function RadiusScale() {
  const radius = tokensByPrefix('radius.', 'primitive');
  const shape = tokensByPrefix('shape.', 'semantic');
  return (
    <div className="flex flex-wrap gap-stack-md">
      {[...radius, ...shape].map((t) => (
        <div key={t.name} className="flex flex-col items-center gap-2">
          <span
            aria-hidden="true"
            className="block size-16 border-2 border-action-primary bg-status-accent-bg"
            style={{ borderRadius: `var(${t.cssVar})` }}
          />
          <Code>{t.name}</Code>
          <Text as="span" variant="caption" tone="muted">
            {String(t.value.light)}
          </Text>
        </div>
      ))}
    </div>
  );
}

const ELEVATION_ROLE: Record<string, string> = {
  'elevation.flat': 'The default. Structure from tone and the border.',
  'elevation.raised': 'A card that floats over the canvas.',
  'elevation.floating': 'Menus, popovers, the select list.',
  'elevation.overlay': 'Dialogs and sheets.',
};

/** The four elevation roles, rendered on layer-1 over the canvas. */
export function ElevationScale() {
  return (
    <div className="layout-grid gap-y-gutter rounded-container bg-surface-canvas p-6">
      {tokensByPrefix('elevation.', 'semantic').map((t) => (
        <div key={t.name} className="col-span-3 flex flex-col gap-2">
          <span
            aria-hidden="true"
            className="block h-20 rounded-container border border-line-default bg-surface-layer-1"
            style={{ boxShadow: `var(${t.cssVar})` }}
          />
          <Code>{t.name}</Code>
          <Text as="span" variant="caption" tone="muted">
            {ELEVATION_ROLE[t.name] ?? ''}
          </Text>
        </div>
      ))}
    </div>
  );
}

const Z_ROLE: Record<string, string> = {
  'z.base': 'Page content.',
  'z.raised': 'An element lifted inside its section, such as a dragged row.',
  'z.sticky': 'TopBar, the PageHeader tab row, sticky table headers.',
  'z.dropdown': 'Select lists and menus.',
  'z.overlay': 'The scrim behind a dialog.',
  'z.modal': 'Dialogs and sheets.',
  'z.popover': 'Popovers opened from inside a dialog.',
  'z.toast': 'Toasts and the focused skip link.',
  'z.tooltip': 'Tooltips, above everything.',
};

export function ZIndexTable() {
  return (
    <TokenTable columns={['Token', 'Value', 'Utility', 'Use for']}>
      {tokensByPrefix('z.', 'primitive').map((t) => (
        <tr key={t.name}>
          <Td nowrap>
            <TokenName>{t.name}</TokenName>
          </Td>
          <Td nowrap>
            <Code>{String(t.value.light)}</Code>
          </Td>
          <Td nowrap>
            <Code>{t.name.replace('.', '-')}</Code>
          </Td>
          <Td>
            <Text variant="body-sm">{Z_ROLE[t.name] ?? ''}</Text>
          </Td>
        </tr>
      ))}
    </TokenTable>
  );
}

const MOTION_UTILITY: Record<string, string> = {
  'duration.instant': 'duration-instant',
  'duration.fast': 'duration-fast',
  'duration.base': 'duration-base',
  'duration.slow': 'duration-slow',
  'duration.spin': 'duration-spin',
  'ease.standard': 'ease-standard',
  'ease.enter': 'ease-enter',
  'ease.exit': 'ease-exit',
  'animation.spin': 'animate-spin',
};

/** Durations, easings and named animations, with the value under reduced motion. */
export function MotionTokens() {
  const tokens = [
    ...tokensByPrefix('duration.', 'primitive'),
    ...tokensByPrefix('ease.', 'primitive'),
    ...tokensByPrefix('animation.', 'primitive'),
  ];
  return (
    <TokenTable columns={['Token', 'Value', 'Reduced motion', 'Utility']}>
      {tokens.map((t) => {
        const reduced = t.name.startsWith('ease.')
          ? 'unchanged'
          : t.name.startsWith('animation.')
            ? 'none'
            : '0ms';
        return (
          <tr key={t.name}>
            <Td nowrap>
              <TokenName>{t.name}</TokenName>
            </Td>
            <Td>
              <Code>{String(t.value.light)}</Code>
            </Td>
            <Td nowrap>
              <Code>{reduced}</Code>
            </Td>
            <Td nowrap>
              <Code>{MOTION_UTILITY[t.name] ?? '—'}</Code>
            </Td>
          </tr>
        );
      })}
    </TokenTable>
  );
}
