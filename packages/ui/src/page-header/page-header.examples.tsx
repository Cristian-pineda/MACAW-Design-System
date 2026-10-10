import { Icon } from '@macaw-ds/icons';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { TabNav } from '../tab-nav/tab-nav.tsx';
import { PageHeader } from './page-header.tsx';

export function Default() {
  return (
    <PageHeader
      title="Invoices"
      description="Every invoice across your customers, newest first."
      actions={
        <>
          <Button variant="secondary" iconStart={<Icon name="download" />}>
            Export
          </Button>
          <Button iconStart={<Icon name="plus" />}>New invoice</Button>
        </>
      }
    />
  );
}

export function Record() {
  return (
    <PageHeader
      title="INV-0041"
      description="Acme Corporation · Due 14 Oct 2026"
      meta={<Badge tone="critical">Overdue</Badge>}
      actions={
        <>
          <Button variant="ghost">Void</Button>
          <Button variant="secondary">Download PDF</Button>
          <Button>Send reminder</Button>
        </>
      }
      tabs={
        <TabNav aria-label="Invoice sections">
          <TabNav.Item href="#overview" active>
            Overview
          </TabNav.Item>
          <TabNav.Item href="#line-items">Line items</TabNav.Item>
          <TabNav.Item href="#payments">Payments</TabNav.Item>
          <TabNav.Item href="#activity">Activity</TabNav.Item>
        </TabNav>
      }
    />
  );
}
