import { Icon } from '@macaw-ds/icons';
import { SideNav } from './side-nav.tsx';

export function Default() {
  return (
    <SideNav aria-label="Main">
      <SideNav.Group>
        <SideNav.Item href="#home" icon={<Icon name="home" />}>
          Home
        </SideNav.Item>
        <SideNav.Item href="#balances" icon={<Icon name="wallet" />}>
          Balances
        </SideNav.Item>
      </SideNav.Group>
      <SideNav.Group title="Billing">
        <SideNav.Item href="#invoices" icon={<Icon name="receipt" />} active>
          Invoices
        </SideNav.Item>
        <SideNav.Item href="#customers" icon={<Icon name="users" />}>
          Customers
        </SideNav.Item>
        <SideNav.Item href="#payouts" icon={<Icon name="landmark" />}>
          Payouts
        </SideNav.Item>
      </SideNav.Group>
      <SideNav.Group title="Settings">
        <SideNav.Item href="#team" icon={<Icon name="building" />}>
          Team
        </SideNav.Item>
      </SideNav.Group>
    </SideNav>
  );
}

export function WithoutIcons() {
  return (
    <SideNav aria-label="Documentation">
      <SideNav.Group title="Foundations">
        <SideNav.Item href="#color" active>
          Color
        </SideNav.Item>
        <SideNav.Item href="#typography">Typography</SideNav.Item>
        <SideNav.Item href="#layout">Layout</SideNav.Item>
      </SideNav.Group>
    </SideNav>
  );
}
