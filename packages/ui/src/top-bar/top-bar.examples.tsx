import { Icon } from '@macaw-ds/icons';
import { Button } from '../button/button.tsx';
import { focusRing } from '../lib/focus.ts';
import { Text } from '../text/text.tsx';
import { TopBar } from './top-bar.tsx';

export function Default() {
  return (
    <TopBar
      brand={
        <a href="#home" className={`inline-flex items-center gap-2 rounded-control ${focusRing}`}>
          <span aria-hidden="true" className="inline-block size-3 rounded-xs bg-action-primary" />
          <Text as="span" variant="heading-md">
            Perch
          </Text>
        </a>
      }
      actions={
        <>
          <Button iconOnly variant="ghost" aria-label="Notifications">
            <Icon name="bell" />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Settings">
            <Icon name="settings" />
          </Button>
        </>
      }
    >
      <Text as="span" variant="label-sm" tone="muted">
        Test mode
      </Text>
    </TopBar>
  );
}
