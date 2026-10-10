import { Icon, type IconName } from '@macaw-ds/icons';
import { Badge, Button, Card, Input, Text } from '@macaw-ds/ui';
import type { ComponentType, ReactElement, ReactNode } from 'react';

export type PlaygroundProps = Record<string, unknown>;

export interface ComponentMapEntry {
  /** The real component rendered in the playground preview. */
  Component: ComponentType<PlaygroundProps>;
  /** Children used when the manifest has no `children` control (compound components, icons). */
  defaultChildren?: ReactNode;
  /** Adjusts props before rendering, e.g. adds the icon child and aria-label for an icon-only button. */
  prepare?: (props: PlaygroundProps) => PlaygroundProps;
  /** Wraps the rendered element, e.g. an Input with its visible label. */
  wrap?: (element: ReactElement, props: PlaygroundProps) => ReactNode;
  /**
   * Loads the gallery examples (named React components with no props). Component sources are
   * `'use client'` modules, so the gallery renders them from a client component; see gallery/example-list.tsx.
   */
  examples: () => Promise<Record<string, unknown>>;
}

/**
 * The only hand-maintained map from registry slug to component (CLAUDE.md "Always").
 * A vitest test asserts it matches the `registry:ui` items in registry/registry.json.
 */
export const componentMap: Record<string, ComponentMapEntry> = {
  text: {
    Component: Text as unknown as ComponentType<PlaygroundProps>,
    defaultChildren: 'Available balance',
    examples: () => import('@content/text/text.examples.tsx'),
  },
  button: {
    Component: Button as unknown as ComponentType<PlaygroundProps>,
    defaultChildren: 'Pay invoice',
    examples: () => import('@content/button/button.examples.tsx'),
    prepare: (props) => {
      if (!props.iconOnly) return props;
      return {
        ...props,
        children: <Icon name="more-horizontal" />,
        'aria-label':
          typeof props['aria-label'] === 'string' ? props['aria-label'] : 'More actions',
      };
    },
  },
  input: {
    Component: Input as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/input/input.examples.tsx'),
    prepare: (props) => ({
      ...props,
      id: typeof props.id === 'string' && props.id ? `playground-${props.id}` : 'playground-input',
    }),
    wrap: (element, props) => (
      <div className="flex w-72 flex-col gap-1">
        <Text as="label" variant="label-sm" htmlFor={String(props.id)}>
          Amount (USD)
        </Text>
        {element}
      </div>
    ),
  },
  badge: {
    Component: Badge as unknown as ComponentType<PlaygroundProps>,
    defaultChildren: 'Paid',
    examples: () => import('@content/badge/badge.examples.tsx'),
  },
  card: {
    Component: Card as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/card/card.examples.tsx'),
    defaultChildren: (
      <>
        <Card.Header>
          <div className="flex flex-col gap-0.5">
            <Card.Title>Gross volume</Card.Title>
            <Card.Description>Last 30 days</Card.Description>
          </div>
          <Badge tone="success" dot>
            Live
          </Badge>
        </Card.Header>
        <Card.Body>
          <Text variant="numeric-lg" numeric>
            $128,430.00
          </Text>
          <Text variant="caption" tone="success">
            +12.4% vs previous period
          </Text>
        </Card.Body>
        <Card.Footer>
          <Button variant="ghost" size="sm">
            Export
          </Button>
          <Button variant="secondary" size="sm">
            View report
          </Button>
        </Card.Footer>
      </>
    ),
    wrap: (element) => <div className="w-80">{element}</div>,
  },
  icon: {
    Component: Icon as unknown as ComponentType<PlaygroundProps>,
    // Icon ships no examples file; the docs keep a small gallery of the whole curated set.
    examples: () => import('../gallery/icon-gallery'),
    prepare: (props) => ({
      ...props,
      name: (typeof props.name === 'string' ? props.name : 'check') as IconName,
      label: props.label || undefined,
    }),
  },
};

export const componentMapSlugs = Object.keys(componentMap);
