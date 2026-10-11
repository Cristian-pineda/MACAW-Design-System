import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BlockThumbnail } from '@/components/block-page/block-thumbnail';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { focusRing } from '@/components/docs-ui/focus';
import { AppShellTemplate } from '@/components/foundations/layout-demos';
import { findBlock } from '@/lib/blocks';
import { cn } from '@/lib/cn';

export const metadata: Metadata = { title: 'Page templates' };

/** Recipe per template block: the layout in one line. The block itself is the source of truth. */
const TEMPLATES: { slug: string; id: string; title: string; intro: string }[] = [
  {
    slug: 'list-template',
    id: 'list',
    title: 'List page',
    intro:
      'A PageHeader with the one primary action, a search and filter toolbar, then rows on a layer-1 card.',
  },
  {
    slug: 'record-template',
    id: 'record',
    title: 'Record page with tabs',
    intro:
      'Status in meta, actions on the right, one URL per tab, then col-span-8 content and a col-span-4 summary.',
  },
  {
    slug: 'dashboard-template',
    id: 'dashboard',
    title: 'Dashboard with a KPI row',
    intro: 'Four KPIs on col-span-3 (or three on col-span-4), then an 8 + 4 split of panels.',
  },
  {
    slug: 'settings-template',
    id: 'form',
    title: 'Form or settings page',
    intro:
      'One column capped at max-w-form, card sections of labelled fields, Save in each card footer.',
  },
];

const LINK = cn(
  'rounded-xs text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
  focusRing,
);

export default function TemplatesPage() {
  return (
    <>
      <Text tone="secondary">
        Five page shapes cover most financial products. AppShell is the frame; the other four are
        template blocks in <code className="font-mono text-code">@macaw-ds/blocks</code> that{' '}
        <code className="font-mono text-code">npx @macaw-ds/cli add &lt;slug&gt;</code> copies into
        your repo. The previews below are the real blocks at half scale. Every page starts with a
        PageHeader whose title is the page&apos;s h1.
      </Text>

      <Section
        id="app-shell"
        title="App shell"
        intro="Once, in the root layout. Every page below renders inside its main area."
      >
        <AppShellTemplate />
        <CodeBlock
          code={`// app/layout.tsx
<AppShell
  topBar={<TopBar brand={<Brand />} actions={<HeaderActions />} />}
  sideNav={<SideNav aria-label="Main">…</SideNav>}
>
  {children}
</AppShell>`}
          lang="tsx"
          copyLabel="Copy app shell recipe"
        />
        <Text variant="body-sm" tone="secondary">
          See{' '}
          <Link href="/components/app-shell" className={LINK}>
            AppShell
          </Link>{' '}
          for the props and the skip link.
        </Text>
      </Section>

      {TEMPLATES.map(({ slug, id, title, intro }) => {
        const block = findBlock('template', slug);
        if (!block) return null;
        return (
          <Section key={slug} id={id} title={title} intro={intro}>
            <BlockThumbnail block={block} />
          </Section>
        );
      })}
    </>
  );
}
