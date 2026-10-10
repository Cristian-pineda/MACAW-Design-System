import { Text } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Section } from '@/components/component-page/section';
import { CodeBlock } from '@/components/docs-ui/code-block';
import {
  AppShellTemplate,
  DashboardTemplate,
  FormTemplate,
  ListTemplate,
  RecordTemplate,
} from '@/components/foundations/layout-demos';

export const metadata: Metadata = { title: 'Page templates' };

const TEMPLATES: {
  id: string;
  title: string;
  intro: string;
  Render: () => ReactNode;
  code: string;
}[] = [
  {
    id: 'app-shell',
    title: 'App shell',
    intro: 'Once, in the root layout. Every page below renders inside its main area.',
    Render: AppShellTemplate,
    code: `// app/layout.tsx
<AppShell
  topBar={<TopBar brand={<Brand />} actions={<HeaderActions />} />}
  sideNav={
    <SideNav aria-label="Main">
      <SideNav.Group title="Billing">
        <SideNav.Item asChild active={pathname === '/invoices'}>
          <Link href="/invoices">Invoices</Link>
        </SideNav.Item>
      </SideNav.Group>
    </SideNav>
  }
>
  {children}
</AppShell>`,
  },
  {
    id: 'list',
    title: 'List page',
    intro: 'A PageHeader with the one primary action, then filters and the table.',
    Render: ListTemplate,
    code: `<PageHeader
  title="Invoices"
  description="Every invoice across your customers, newest first."
  actions={<Button iconStart={<Icon name="plus" />}>New invoice</Button>}
/>
<div className="flex flex-col gap-stack-md px-margin py-section">
  <Input type="search" aria-label="Search invoices" startAdornment={<Icon name="search" />} />
  <table>…</table>
</div>`,
  },
  {
    id: 'record',
    title: 'Record page with tabs',
    intro:
      'Status in meta, actions on the right, one URL per tab. The tab row sticks below the TopBar.',
    Render: RecordTemplate,
    code: `<PageHeader
  title="INV-0041"
  meta={<Badge tone="critical">Overdue</Badge>}
  actions={<Button>Send reminder</Button>}
  tabs={
    <TabNav aria-label="Invoice sections">
      <TabNav.Item asChild active={pathname === base}>
        <Link href={base}>Overview</Link>
      </TabNav.Item>
      <TabNav.Item asChild active={pathname === \`\${base}/payments\`}>
        <Link href={\`\${base}/payments\`}>Payments</Link>
      </TabNav.Item>
    </TabNav>
  }
/>
<div className="layout-grid gap-y-gutter px-margin py-section">
  <div className="col-span-8">{/* details */}</div>
  <div className="col-span-4">{/* summary */}</div>
</div>`,
  },
  {
    id: 'dashboard',
    title: 'Dashboard with a KPI row',
    intro: 'Four KPI cards on col-span-3, then an 8 + 4 split.',
    Render: DashboardTemplate,
    code: `<PageHeader title="Overview" actions={<Button variant="secondary">Last 30 days</Button>} />
<div className="layout-grid gap-y-gutter px-margin py-section">
  <div className="col-span-3">
    <Card padding="sm">
      <Card.Body>
        <Text variant="label-sm" tone="secondary">Gross volume</Text>
        <Text variant="numeric-md" numeric>$128,430.00</Text>
      </Card.Body>
    </Card>
  </div>
  {/* three more col-span-3 KPI cards */}
  <div className="col-span-8">{/* chart */}</div>
  <div className="col-span-4">{/* list */}</div>
</div>`,
  },
  {
    id: 'form',
    title: 'Form or settings page',
    intro: 'One column capped at max-w-form, fields on stack-md, actions in the card footer.',
    Render: FormTemplate,
    code: `<PageHeader title="Business settings" description="Shown on invoices and receipts." />
<div className="px-margin py-section">
  <div className="max-w-form">
    <Card>
      <Card.Body>
        <div className="flex flex-col gap-stack-md">
          <div className="flex flex-col gap-1">
            <Text as="label" variant="label-sm" htmlFor="legal-name">Legal name</Text>
            <Input id="legal-name" />
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </Card.Footer>
    </Card>
  </div>
</div>`,
  },
];

export default function TemplatesPage() {
  return (
    <>
      <Text tone="secondary">
        Five page shapes cover most financial products. Each is a live render with the real
        components, and the recipe below it is what to copy. Every page starts with a PageHeader
        whose title is the page&apos;s h1; the renders here use h2 because this page already has
        one.
      </Text>
      {TEMPLATES.map(({ id, title, intro, Render, code }) => (
        <Section key={id} id={id} title={title} intro={intro}>
          <Render />
          <CodeBlock code={code} lang="tsx" copyLabel={`Copy ${title.toLowerCase()} recipe`} />
        </Section>
      ))}
    </>
  );
}
