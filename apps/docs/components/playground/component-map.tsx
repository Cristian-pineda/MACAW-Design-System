import { Icon, type IconName } from '@macaw-ds/icons';
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  SideNav,
  TabNav,
  Text,
  TopBar,
} from '@macaw-ds/ui';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { focusRing } from '@/components/docs-ui/focus';
import { cn } from '@/lib/cn';
import { Default as AppShellPreview } from '../gallery/app-shell-preview';

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
  /**
   * Replaces the generated snippet for compound or slot-based components, where buildJsxSnippet
   * would put item props (active, title) on the root or omit the required slots.
   */
  snippet?: (props: PlaygroundProps) => string;
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value ? value : fallback;
}

/** Props that belong to SideNav.Item / TabNav.Item / SideNav.Group, never to the root element. */
function withoutItemProps(props: PlaygroundProps): PlaygroundProps {
  const { active: _active, asChild: _asChild, title: _title, icon: _icon, ...rest } = props;
  return rest;
}

const brand = (
  <a href="#home" className={cn('inline-flex items-center gap-2 rounded-control', focusRing)}>
    <span aria-hidden="true" className="inline-block size-3 rounded-xs bg-action-primary" />
    <Text as="span" variant="heading-md">
      Perch
    </Text>
  </a>
);

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
  'app-shell': {
    // The real AppShell renders the page's banner and main landmarks; inside a docs page the
    // preview composes the same parts instead (see gallery/app-shell-preview.tsx).
    Component: AppShellPreview as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('../gallery/app-shell-preview'),
    snippet: () => `import { AppShell, PageHeader, SideNav, TopBar } from '@macaw-ds/ui';

<AppShell
  topBar={<TopBar brand={<Brand />} actions={<Actions />} />}
  sideNav={
    <SideNav aria-label="Main">
      <SideNav.Group title="Billing">
        <SideNav.Item href="/invoices" active>Invoices</SideNav.Item>
      </SideNav.Group>
    </SideNav>
  }
>
  <PageHeader title="Invoices" />
  <div className="layout-grid px-margin py-section">…</div>
</AppShell>
`,
  },
  'top-bar': {
    Component: TopBar as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/top-bar/top-bar.examples.tsx'),
    prepare: (props) => ({
      ...props,
      brand,
      actions: (
        <>
          <Button iconOnly variant="ghost" aria-label="Notifications">
            <Icon name="bell" />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Settings">
            <Icon name="settings" />
          </Button>
        </>
      ),
    }),
    defaultChildren: (
      <Text as="span" variant="label-sm" tone="muted">
        Test mode
      </Text>
    ),
    wrap: (element) => (
      <div className="w-full overflow-hidden rounded-container border border-line-default">
        {element}
      </div>
    ),
    snippet: () => `import { Button, TopBar } from '@macaw-ds/ui';

<TopBar
  brand={<Link href="/">Perch</Link>}
  actions={
    <Button iconOnly variant="ghost" aria-label="Notifications">
      <Icon name="bell" />
    </Button>
  }
/>
`,
  },
  'side-nav': {
    Component: SideNav as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/side-nav/side-nav.examples.tsx'),
    prepare: (props) => ({
      ...withoutItemProps(props),
      'aria-label': str(props['aria-label'], 'Main'),
      children: (
        <SideNav.Group title={str(props.title, 'Billing')}>
          <SideNav.Item
            href="#invoices"
            icon={<Icon name="receipt" />}
            active={Boolean(props.active)}
          >
            Invoices
          </SideNav.Item>
          <SideNav.Item href="#customers" icon={<Icon name="users" />}>
            Customers
          </SideNav.Item>
          <SideNav.Item href="#payouts" icon={<Icon name="landmark" />}>
            Payouts
          </SideNav.Item>
        </SideNav.Group>
      ),
    }),
    wrap: (element) => (
      <div className="w-sidenav rounded-container border border-line-default bg-surface-layer-1">
        {element}
      </div>
    ),
    snippet: (props) => `import { SideNav } from '@macaw-ds/ui';

<SideNav aria-label="${str(props['aria-label'], 'Main')}">
  <SideNav.Group title="${str(props.title, 'Billing')}">
    <SideNav.Item asChild${props.active ? ' active' : ''}>
      <Link href="/invoices">Invoices</Link>
    </SideNav.Item>
    <SideNav.Item asChild>
      <Link href="/customers">Customers</Link>
    </SideNav.Item>
  </SideNav.Group>
</SideNav>
`,
  },
  'tab-nav': {
    Component: TabNav as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/tab-nav/tab-nav.examples.tsx'),
    prepare: (props) => ({
      ...withoutItemProps(props),
      'aria-label': str(props['aria-label'], 'Page sections'),
      children: (
        <>
          <TabNav.Item href="#overview" active={Boolean(props.active)}>
            Overview
          </TabNav.Item>
          <TabNav.Item href="#line-items">Line items</TabNav.Item>
          <TabNav.Item href="#payments">Payments</TabNav.Item>
        </>
      ),
    }),
    wrap: (element) => <div className="w-full border-b border-line-default">{element}</div>,
    snippet: (props) => `import { TabNav } from '@macaw-ds/ui';

<TabNav aria-label="${str(props['aria-label'], 'Page sections')}">
  <TabNav.Item asChild${props.active ? ' active' : ''}>
    <Link href="/invoices/inv-0041">Overview</Link>
  </TabNav.Item>
  <TabNav.Item asChild>
    <Link href="/invoices/inv-0041/payments">Payments</Link>
  </TabNav.Item>
</TabNav>
`,
  },
  'page-header': {
    Component: PageHeader as unknown as ComponentType<PlaygroundProps>,
    examples: () => import('@content/page-header/page-header.examples.tsx'),
    prepare: (props) => ({
      ...props,
      title: str(props.title, 'Invoices'),
      actions: (
        <>
          <Button variant="secondary" iconStart={<Icon name="download" />}>
            Export
          </Button>
          <Button iconStart={<Icon name="plus" />}>New invoice</Button>
        </>
      ),
    }),
    wrap: (element) => (
      <div className="w-full overflow-hidden rounded-container border border-line-default">
        {element}
      </div>
    ),
    snippet: (props) => {
      const level = props.headingLevel === 'h2' ? ' headingLevel="h2"' : '';
      const description =
        typeof props.description === 'string' && props.description
          ? `\n  description="${props.description}"`
          : '';
      return `import { Button, PageHeader } from '@macaw-ds/ui';

<PageHeader
  title="${str(props.title, 'Invoices')}"${description}${level}
  actions={<Button>New invoice</Button>}
/>
`;
    },
  },
};

export const componentMapSlugs = Object.keys(componentMap);
