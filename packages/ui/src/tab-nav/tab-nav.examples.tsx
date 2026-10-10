import { TabNav } from './tab-nav.tsx';

export function Default() {
  return (
    <TabNav aria-label="Invoice sections">
      <TabNav.Item href="#overview" active>
        Overview
      </TabNav.Item>
      <TabNav.Item href="#line-items">Line items</TabNav.Item>
      <TabNav.Item href="#payments">Payments</TabNav.Item>
      <TabNav.Item href="#activity">Activity</TabNav.Item>
    </TabNav>
  );
}

export function ComponentSections() {
  return (
    <TabNav aria-label="Component sections">
      <TabNav.Item href="#overview">Overview</TabNav.Item>
      <TabNav.Item href="#usage" active>
        Usage
      </TabNav.Item>
      <TabNav.Item href="#accessibility">Accessibility</TabNav.Item>
      <TabNav.Item href="#code">Code</TabNav.Item>
    </TabNav>
  );
}
