# MACAW templates and pages (generated, v0.2.2)

Templates are page structure with placeholder content; pages are templates filled with realistic content. Both are compositions you copy in and own; the components inside still come from `@macaw-ds/ui`. Start a new screen from the closest template instead of composing from scratch, and read the page examples to see how a template is filled.

## Templates

### Dashboard (`dashboard-template`)

Structure for an overview: a header, a row of three or four KPIs, then a wide and a narrow panel.

- Install: `npx @macaw-ds/cli add dashboard-template` (writes `components/macaw/blocks/dashboard-template.tsx`)
- Source: `blocks/dashboard-template.tsx` · exports `DashboardTemplate`
- Uses: page-header, card, text, button, icon
- Use for: The landing page of a product area: billing, treasury, payouts. A few headline figures followed by what needs attention.
- Not for: More than four KPIs: split the page or move figures into a panel. A single record or a long list: use the record or list template.
- Rules: Render inside AppShell's main; never add a second main or a TopBar. The PageHeader title is the page's only h1; panel titles are h2. Three or four KPIs; every value is Text numeric. A delta's sentiment says whether it is good news; up is not always positive. At most one primary Button, in the PageHeader actions.

### List (`list-template`)

Structure for a list page: header with one primary action, a search and filter toolbar, and rows on a card.

- Install: `npx @macaw-ds/cli add list-template` (writes `components/macaw/blocks/list-template.tsx`)
- Source: `blocks/list-template.tsx` · exports `ListTemplate`
- Uses: page-header, button, input, card, text, badge, icon
- Use for: A collection the user scans, searches and filters: invoices, customers, payouts. Rows with a name, a status and one figure.
- Not for: Comparing many columns of numbers: wait for the Table component instead of faking one with a grid. A single record: use the record template.
- Rules: Render inside AppShell's main; never add a second main or a TopBar. The PageHeader title is the page's only h1. At most one primary Button on the page, in the PageHeader actions. The search Input needs an aria-label (or a visible label). Keep the list a semantic ul with one li per row; amounts use Text numeric with align end.

### Record (`record-template`)

Structure for a single record: status, actions and section tabs in the header, then main content and a summary column.

- Install: `npx @macaw-ds/cli add record-template` (writes `components/macaw/blocks/record-template.tsx`)
- Source: `blocks/record-template.tsx` · exports `RecordTemplate`, `RecordSummary`
- Uses: page-header, tab-nav, card, text, badge, button, icon
- Use for: One invoice, customer, payout or subscription with sections the user can link to. A record with a short set of key facts that should stay visible next to the details.
- Not for: Switching panels in place without changing the URL: that is a Tabs component, not TabNav. Editing many settings: use the settings template.
- Rules: Render inside AppShell's main; never add a second main or a TopBar. The PageHeader title is the page's only h1; card titles are h2. Every tab is a link to its own URL with active set on the current one. At most one primary Button, in the PageHeader actions. The summary column is col-span-4 and the main column col-span-8.

### Settings (`settings-template`)

Structure for a settings or form page: a header, then card sections of labelled fields in one column.

- Install: `npx @macaw-ds/cli add settings-template` (writes `components/macaw/blocks/settings-template.tsx`)
- Source: `blocks/settings-template.tsx` · exports `SettingsTemplate`
- Uses: page-header, card, text, input, button
- Use for: Account, business, payout or notification settings. Any form that splits into a few independently saved groups.
- Not for: A multi-step flow such as onboarding: one step per page with its own primary action. A record with actions: use the record template.
- Rules: Render inside AppShell's main; never add a second main or a TopBar. The PageHeader title is the page's only h1; section titles are h2. Every Input has a visible label via Text as label with htmlFor; hints are linked with aria-describedby. Only one primary Button on the page: the last section's Save. Field ids are unique on the page.


## Pages

### Account settings (`account-settings`)

Account settings for a billing product: business details, the payout account and notification recipients.

- Install: `npx @macaw-ds/cli add account-settings` (writes `components/macaw/blocks/account-settings.tsx` and its template `settings-template`)
- Source: `blocks/account-settings.tsx` · exports `AccountSettings`
- Uses: page-header, card, text, input, button
- Fills template: settings-template
- Use for: Starting point for the settings area of a billing or payments product.
- Not for: As a component: copy it and wire each section's Save to your API.
- Rules: Amounts use align end with a currency adornment. Read-only values say how to change them in a hint. Save notifications, the last section's button, is the page's only primary Button.

### Billing dashboard (`billing-dashboard`)

A billing overview: volume, revenue, outstanding and overdue KPIs, overdue invoices to chase and upcoming payouts.

- Install: `npx @macaw-ds/cli add billing-dashboard` (writes `components/macaw/blocks/billing-dashboard.tsx` and its template `dashboard-template`)
- Source: `blocks/billing-dashboard.tsx` · exports `BillingDashboard`
- Uses: page-header, card, text, badge, button, icon
- Fills template: dashboard-template
- Use for: Starting point for the home page of a billing or invoicing product.
- Not for: As a component: copy it and replace the data with your queries.
- Rules: Keep money in Text numeric, end-aligned. Overdue is critical; in transit is info; scheduled is neutral. Create invoice is the page's only primary Button.

### Invoice record (`invoice-record`)

An overdue invoice: status, reminder and download actions, line items with totals and a summary of what is owed.

- Install: `npx @macaw-ds/cli add invoice-record` (writes `components/macaw/blocks/invoice-record.tsx` and its template `record-template`)
- Source: `blocks/invoice-record.tsx` · exports `InvoiceRecord`
- Uses: page-header, tab-nav, card, text, badge, button, icon
- Fills template: record-template
- Use for: Starting point for an invoice, bill or payment detail page.
- Not for: As a component: copy it and replace the data with your queries.
- Rules: Send reminder is the only primary Button; Void is ghost so it does not compete. Each tab links to its own URL. Totals are a definition list with numerals end-aligned.

