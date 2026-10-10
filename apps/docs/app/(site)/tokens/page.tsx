import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { ContrastBadge } from '@/components/tokens/contrast-badge';
import { MotionDemo } from '@/components/tokens/motion-demo';
import { Swatch } from '@/components/tokens/swatch';
import { Td, TokenTable } from '@/components/tokens/token-table';
import {
  contrast,
  getColorRamps,
  getSemanticColorGroups,
  getToken,
  getTokensVersion,
  getTypographyVariant,
  TEXT_VARIANTS,
  tokensByPrefix,
  type TokenEntry,
} from '@/lib/tokens';

export const metadata: Metadata = { title: 'Tokens' };

/** The background a semantic foreground token is meant to sit on, when that pairing is part of the contract. */
function pairFor(name: string): string | null {
  if (name.startsWith('color.fg.'))
    return name.endsWith('inverse')
      ? 'color.surface.inverse'
      : name.endsWith('on-accent')
        ? 'color.action.primary'
        : 'color.surface.default';
  const status = /^color\.status\.([a-z]+)-(solid-fg|fg)$/.exec(name);
  if (status)
    return status[2] === 'fg' ? `color.status.${status[1]}-bg` : `color.status.${status[1]}-solid`;
  const action = /^color\.action\.([a-z]+)-fg$/.exec(name);
  if (action)
    return action[1] === 'disabled' ? 'color.action.disabled' : `color.action.${action[1]}`;
  if (name === 'color.focus.ring') return 'color.surface.default';
  if (name.startsWith('color.status.') && !name.includes('-')) return 'color.surface.default';
  if (name === 'color.field.line') return 'color.field.bg';
  return null;
}

function Code({ children }: { children: string }) {
  return (
    <Text as="span" variant="code" tone="secondary">
      {children}
    </Text>
  );
}

function SampleText({ variant }: { variant: (typeof TEXT_VARIANTS)[number] }) {
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

export default function TokensPage() {
  const ramps = getColorRamps();
  const semantic = getSemanticColorGroups();
  const space = tokensByPrefix('space.', 'primitive');
  const radius = tokensByPrefix('radius.', 'primitive');
  const shape = tokensByPrefix('shape.', 'semantic');
  const elevation = tokensByPrefix('elevation.', 'semantic');
  const durations = tokensByPrefix('duration.', 'primitive');
  const easings = tokensByPrefix('ease.', 'primitive');

  return (
    <>
      <div className="flex flex-col gap-2">
        <Text as="h1" variant="display-md">
          Tokens
        </Text>
        <Text variant="body-lg" tone="secondary">
          Three tiers: primitive (<Code>color.neutral.600</Code>), semantic (
          <Code>color.action.primary</Code>), component (<Code>button.bg.primary</Code>
          ). Components reference semantic tokens only. Version {getTokensVersion()}, generated from{' '}
          <Code>packages/tokens/src</Code>.
        </Text>
      </div>

      <Section
        id="color"
        title="Colour ramps"
        intro="The primitive tier. Status ramps share identical lightness steps; the neutral ramp is cool grey."
      >
        <div className="flex flex-col gap-4">
          {ramps.map(({ ramp, steps }) => (
            <div key={ramp} className="flex flex-col gap-1">
              <Text as="h3" variant="label-md">
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
      </Section>

      <Section
        id="semantic"
        title="Semantic colours"
        intro="The tier components use. Each row shows both modes; the contrast badge is computed from the oklch values against the surface the token is meant to sit on."
      >
        <div className="flex flex-col gap-6">
          {semantic.map(({ group, tokens }) => (
            <div key={group} className="flex flex-col gap-2">
              <Text as="h3" variant="heading-sm">
                {group}
              </Text>
              <TokenTable columns={['Token', 'Light', 'Dark', 'Contrast (light / dark)']}>
                {tokens.map((t) => {
                  const pair = pairFor(t.name);
                  const bg = pair ? getToken(pair) : undefined;
                  return (
                    <tr key={t.name}>
                      <Td nowrap>
                        <Text as="span" variant="code">
                          {t.name.replace('color.', '')}
                        </Text>
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
      </Section>

      <Section
        id="typography"
        title="Typography"
        intro="Fifteen named roles. Every string on screen uses one through <Text>; numeric roles set tabular numerals and the 7:1 numeric colour."
      >
        <TokenTable columns={['Variant', 'Sample', 'Size / leading', 'Weight / tracking']}>
          {TEXT_VARIANTS.map((variant) => {
            const t = getTypographyVariant(variant);
            return (
              <tr key={variant}>
                <Td nowrap>
                  <Text as="span" variant="code">
                    {variant}
                  </Text>
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
      </Section>

      <Section
        id="space"
        title="Space"
        intro="A 4 px scale. Tailwind's spacing utilities (p-4, gap-2) map to it; semantic layout tokens name the common distances."
      >
        <TokenTable columns={['Token', 'Value', 'Scale']}>
          {space.map((t) => (
            <tr key={t.name}>
              <Td nowrap>
                <Text as="span" variant="code">
                  {t.name}
                </Text>
              </Td>
              <Td nowrap>
                <Code>{String(t.value.light)}</Code>
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
      </Section>

      <Section
        id="radius"
        title="Radius"
        intro="Radii of 8 px or less (DECISIONS.md #15). Semantic shapes name what each radius is for."
      >
        <div className="flex flex-wrap gap-4">
          {[...radius, ...shape].map((t) => (
            <div key={t.name} className="flex flex-col items-center gap-2">
              <span
                aria-hidden="true"
                className="block size-16 border-2 border-action-primary bg-status-accent-bg"
                style={{ borderRadius: `var(${t.cssVar})` }}
              />
              <Text as="span" variant="code" tone="secondary">
                {t.name}
              </Text>
              <Text as="span" variant="caption" tone="muted">
                {String(t.value.light)}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="elevation"
        title="Elevation"
        intro="Structure comes from the 1 px border; elevation is optional and subtle."
      >
        <div className="grid gap-6 rounded-container bg-surface-canvas p-6 md:grid-cols-4">
          {elevation.map((t: TokenEntry) => (
            <div key={t.name} className="flex flex-col gap-2">
              <span
                aria-hidden="true"
                className="block h-20 rounded-container border border-line-default bg-surface-default"
                style={{ boxShadow: `var(${t.cssVar})` }}
              />
              <Text as="span" variant="code" tone="secondary">
                {t.name}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        intro="Four durations and three easings. Reduced motion is honoured at the token layer, so components never branch on it."
      >
        <div className="flex flex-col gap-4">
          <MotionDemo durations={durations} />
          <TokenTable columns={['Token', 'Value']}>
            {[...durations, ...easings].map((t) => (
              <tr key={t.name}>
                <Td nowrap>
                  <Text as="span" variant="code">
                    {t.name}
                  </Text>
                </Td>
                <Td>
                  <Code>{String(t.value.light)}</Code>
                </Td>
              </tr>
            ))}
          </TokenTable>
        </div>
      </Section>
    </>
  );
}
