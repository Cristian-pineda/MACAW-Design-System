import * as SideNavExamples from '../side-nav/side-nav.examples.tsx';
import * as TopBarExamples from '../top-bar/top-bar.examples.tsx';
import * as PageHeaderExamples from '../page-header/page-header.examples.tsx';
import { Card } from '../card/card.tsx';
import { Text } from '../text/text.tsx';
import { AppShell } from './app-shell.tsx';

export function Default() {
  return (
    <AppShell
      topBar={<TopBarExamples.Default />}
      sideNav={<SideNavExamples.Default />}
      mainId="example-main"
    >
      <PageHeaderExamples.Default />
      <div className="layout-grid px-margin py-section">
        {['Outstanding', 'Overdue', 'Paid this month'].map((label) => (
          <div key={label} className="col-span-4">
            <Card padding="sm">
              <Card.Body>
                <Text variant="label-sm" tone="secondary">
                  {label}
                </Text>
                <Text variant="numeric-lg" numeric>
                  $42,180.00
                </Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
