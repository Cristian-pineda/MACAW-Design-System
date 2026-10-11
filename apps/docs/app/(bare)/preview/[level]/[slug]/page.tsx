import { Icon } from '@macaw-ds/icons';
import { AppShell, Button, SideNav, Text, TopBar } from '@macaw-ds/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { renderBlock } from '@/components/block-page/load';
import { PreviewScope } from '@/components/block-page/preview-scope';
import { findBlock, getBlocks, type BlockLevel } from '@/lib/blocks';

type Params = { params: Promise<{ level: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getBlocks().map((b) => ({ level: b.level, slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { level, slug } = await params;
  const block = findBlock(level as BlockLevel, slug);
  return { title: block ? `${block.name} preview` : 'Preview', robots: { index: false } };
}

/** Which SideNav item is current, by block slug. */
const ACTIVE: Record<string, 'home' | 'invoices' | 'customers' | 'settings'> = {
  'dashboard-template': 'home',
  'billing-dashboard': 'home',
  'list-template': 'invoices',
  'record-template': 'invoices',
  'invoice-record': 'invoices',
  'settings-template': 'settings',
  'account-settings': 'settings',
};

/**
 * A template or page in the real AppShell, as its own document. The docs embed it in a titled
 * iframe so the preview has its own landmarks and its own single h1 (WCAG 1.3.1, 2.4.6).
 */
export default async function BlockPreviewDocument({ params }: Params) {
  const { level, slug } = await params;
  const block = findBlock(level as BlockLevel, slug);
  if (!block) notFound();
  const active = ACTIVE[block.slug] ?? 'home';
  return (
    <Suspense>
      <PreviewScope>
        <AppShell
          sideNavLabel="Example app navigation"
          mainLabel="Example app content"
          topBar={
            <TopBar
              aria-label="Example app"
              brand={
                <Text as="span" variant="heading-md">
                  Perch
                </Text>
              }
              actions={
                <Button iconOnly variant="ghost" aria-label="Notifications">
                  <Icon name="bell" />
                </Button>
              }
            />
          }
          sideNav={
            <SideNav aria-label="Example app">
              <SideNav.Group>
                <SideNav.Item href="#home" icon={<Icon name="home" />} active={active === 'home'}>
                  Home
                </SideNav.Item>
              </SideNav.Group>
              <SideNav.Group title="Billing">
                <SideNav.Item
                  href="#invoices"
                  icon={<Icon name="receipt" />}
                  active={active === 'invoices'}
                >
                  Invoices
                </SideNav.Item>
                <SideNav.Item
                  href="#customers"
                  icon={<Icon name="users" />}
                  active={active === 'customers'}
                >
                  Customers
                </SideNav.Item>
              </SideNav.Group>
              <SideNav.Group title="Account">
                <SideNav.Item
                  href="#settings"
                  icon={<Icon name="settings" />}
                  active={active === 'settings'}
                >
                  Settings
                </SideNav.Item>
              </SideNav.Group>
            </SideNav>
          }
        >
          {renderBlock(block)}
        </AppShell>
      </PreviewScope>
    </Suspense>
  );
}
