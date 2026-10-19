# MACAW components (generated, v0.2.1)

Read the manifest in `manifests/<slug>.json` before using a component. Import everything from `@macaw-ds/ui` (Icon from `@macaw-ds/icons`).

Components are grouped by atomic level. A level composes only levels below it: atoms, then molecules, organisms and templates. Templates and pages that are whole screens live in `blocks.md`.

## Atoms

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
| Badge | `import { Badge } from '@macaw-ds/ui'` | A short, non-interactive status label such as Paid, Overdue or Draft. Not a button, not a counter. | tone: neutral / success / warning / critical / info / accent; variant: soft / solid / outline; size: sm / md; dot: boolean | The label is a word or two that states the status in plain language. Tone follows meaning, not decoration: critical means failed or overdue, never "important". |
| Button | `import { Button } from '@macaw-ds/ui'` | Triggers an action. Not navigation; for links use asChild with an anchor. | variant: primary / secondary / ghost / destructive; size: sm / md / lg; loading: boolean; disabled: boolean; iconOnly: boolean; asChild: boolean; iconStart: node; iconEnd: node | One primary button per view. Everything else is secondary or ghost. Label is a verb phrase: "Pay invoice", not "OK" or "Submit". |
| Icon | `import { Icon } from '@macaw-ds/icons'` | Renders one icon from the curated set, bound to size and tone tokens. Not for logos or illustrations. | name: arrow-up-right / arrow-down-right / arrow-up / arrow-down / arrow-left / arrow-right … (61 values, see manifest); size: sm / md / lg / xl; tone: inherit / primary / secondary / muted / success / warning … (9 values, see manifest); label: string; strokeWidth: number | Icons next to visible text are decorative: do not pass label. An icon that is the only content of a control needs a label, or the control needs aria-label. |
| Input | `import { Input } from '@macaw-ds/ui'` | Single-line text entry: names, emails, references, amounts. Not for multi-line text, dates or selections. | type: text / email / password / search / url / tel / number; size: sm / md / lg; align: start / end; invalid: boolean; disabled: boolean; readOnly: boolean; placeholder: string; startAdornment: node; endAdornment: node; id: string | Every Input has a visible label (Text as="label" htmlFor) unless it is a search box with aria-label. Amounts use align="end" and inputMode="decimal"; the consumer formats the value. |
| Text | `import { Text } from '@macaw-ds/ui'` | Renders text in a named typographic role and tone. Every string on screen goes through it; nothing else sets font size or colour. | as: p / span / div / h1 / h2 / h3 … (16 values, see manifest); variant: display-lg / display-md / heading-lg / heading-md / heading-sm / body-lg … (15 values, see manifest); tone: primary / secondary / muted / inverse / numeric / success … (10 values, see manifest); align: start / center / end; numeric: boolean; truncate: boolean | All text goes through Text. Never apply text-* or font-* utilities to raw elements. Money, counts and dates use numeric (or a numeric-* role) so columns line up. |

## Molecules

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
| Card | `import { Card } from '@macaw-ds/ui'` | A bordered surface that groups related content: a KPI, a form section, a record summary. Not a page, not a modal. | padding: none / sm / md; elevation: flat / raised; interactive: boolean; asChild: boolean | Use the sections (Header, Body, Footer) rather than custom padding; the Card owns its spacing. Card.Title sets the heading level with `as` to fit the page outline. |
| TabNav | `import { TabNav } from '@macaw-ds/ui'` | Page-level tabs where each tab is its own URL. Not for switching panels in place; that is Tabs (not in the system yet). | aria-label: string; active: boolean; asChild: boolean | Each tab is a URL. Use TabNav only when the sections are separate pages or routes. Exactly one item is active, and it matches the current route. |

## Organisms

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
| PageHeader | `import { PageHeader } from '@macaw-ds/ui'` | The page's own header under the TopBar: title, description, meta, actions and section tabs. Not the global header; that is TopBar. | title: string; description: string; headingLevel: h1 / h2; meta: node; actions: node; tabs: node | One PageHeader per page, first inside main. The title is the page's only h1. |
| SideNav | `import { SideNav } from '@macaw-ds/ui'` | The product's primary navigation in the left column of AppShell. Not for sections within a page; that is TabNav. | aria-label: string; title: string; active: boolean; icon: node; asChild: boolean | Exactly one item is active, and it matches the current route. Group related destinations under a short heading; keep fewer than ten items per group. |
| TopBar | `import { TopBar } from '@macaw-ds/ui'` | The application's global header: brand, optional centre content and actions. Not a page title; that is PageHeader. | brand: node; actions: node | One TopBar per page, placed in AppShell's topBar slot. Actions are ghost Buttons; icon-only actions need aria-label. |

## Templates

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
| AppShell | `import { AppShell } from '@macaw-ds/ui'` | The application frame: skip link, sticky TopBar, full-height SideNav column and the main area. One per app, at the root layout. | topBar: node; sideNav: node; sideNavLabel: string; mainId: string; mainLabel: string; skipLinkLabel: string | One AppShell per application, at the root layout. Put a TopBar in topBar and a SideNav in sideNav; do not build the frame by hand. |

## Not in the system yet

Anything not listed above. Say `not-in-system: <what>` instead of building it: tables, select, dialog, tooltip, popover, in-page tabs, toast, date picker, number or money input, textarea, checkbox, radio, switch, dropdown menu, command palette.

## Status

- AppShell: beta since 0.1.0, budget 1500 B gzipped
- Badge: beta since 0.1.0, budget 2500 B gzipped
- Button: beta since 0.1.0, budget 4000 B gzipped
- Card: beta since 0.1.0, budget 3000 B gzipped
- Icon: beta since 0.1.0, budget 14000 B gzipped
- Input: beta since 0.1.0, budget 2500 B gzipped
- PageHeader: beta since 0.1.0, budget 1500 B gzipped
- SideNav: beta since 0.1.0, budget 2000 B gzipped
- TabNav: beta since 0.1.0, budget 2000 B gzipped
- Text: beta since 0.1.0, budget 2000 B gzipped
- TopBar: beta since 0.1.0, budget 1000 B gzipped
