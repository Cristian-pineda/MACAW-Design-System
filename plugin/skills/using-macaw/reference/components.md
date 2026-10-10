# MACAW components (generated, v0.0.0)

Read the manifest in `manifests/<slug>.json` before using a component. Import everything from `@macaw-ds/ui` (Icon from `@macaw-ds/icons`).

| Component | Import | Purpose | Props | First rules |
|---|---|---|---|---|
| Badge | `import { Badge } from '@macaw-ds/ui'` | A short, non-interactive status label such as Paid, Overdue or Draft. Not a button, not a counter. | tone: neutral / success / warning / critical / info / accent; variant: soft / solid / outline; size: sm / md; dot: boolean | The label is a word or two that states the status in plain language. Tone follows meaning, not decoration: critical means failed or overdue, never "important". |
| Button | `import { Button } from '@macaw-ds/ui'` | Triggers an action. Not navigation; for links use asChild with an anchor. | variant: primary / secondary / ghost / destructive; size: sm / md / lg; loading: boolean; disabled: boolean; iconOnly: boolean; asChild: boolean; iconStart: node; iconEnd: node | One primary button per view. Everything else is secondary or ghost. Label is a verb phrase: "Pay invoice", not "OK" or "Submit". |
| Card | `import { Card } from '@macaw-ds/ui'` | A bordered surface that groups related content: a KPI, a form section, a record summary. Not a page, not a modal. | padding: none / sm / md; elevation: flat / raised; interactive: boolean; asChild: boolean | Use the sections (Header, Body, Footer) rather than custom padding; the Card owns its spacing. Card.Title sets the heading level with `as` to fit the page outline. |
| Icon | `import { Icon } from '@macaw-ds/icons'` | Renders one icon from the curated set, bound to size and tone tokens. Not for logos or illustrations. | name: arrow-up-right / arrow-down-right / arrow-up / arrow-down / arrow-left / arrow-right … (61 values, see manifest); size: sm / md / lg / xl; tone: inherit / primary / secondary / muted / success / warning … (9 values, see manifest); label: string; strokeWidth: number | Icons next to visible text are decorative: do not pass label. An icon that is the only content of a control needs a label, or the control needs aria-label. |
| Input | `import { Input } from '@macaw-ds/ui'` | Single-line text entry: names, emails, references, amounts. Not for multi-line text, dates or selections. | type: text / email / password / search / url / tel / number; size: sm / md / lg; align: start / end; invalid: boolean; disabled: boolean; readOnly: boolean; placeholder: string; startAdornment: node; endAdornment: node; id: string | Every Input has a visible label (Text as="label" htmlFor) unless it is a search box with aria-label. Amounts use align="end" and inputMode="decimal"; the consumer formats the value. |
| Text | `import { Text } from '@macaw-ds/ui'` | Renders text in a named typographic role and tone. Every string on screen goes through it; nothing else sets font size or colour. | as: p / span / div / h1 / h2 / h3 … (16 values, see manifest); variant: display-lg / display-md / heading-lg / heading-md / heading-sm / body-lg … (15 values, see manifest); tone: primary / secondary / muted / inverse / numeric / success … (10 values, see manifest); align: start / center / end; numeric: boolean; truncate: boolean | All text goes through Text. Never apply text-* or font-* utilities to raw elements. Money, counts and dates use numeric (or a numeric-* role) so columns line up. |

## Not in the system yet

Anything not listed above. Say `not-in-system: <what>` instead of building it: tables, select, dialog, tooltip, popover, tabs, toast, date picker, number or money input, textarea, checkbox, radio, switch, dropdown menu, command palette, app shell.

## Status

- Badge: beta since 0.1.0, budget 2500 B gzipped
- Button: beta since 0.1.0, budget 4000 B gzipped
- Card: beta since 0.1.0, budget 3000 B gzipped
- Icon: beta since 0.1.0, budget 14000 B gzipped
- Input: beta since 0.1.0, budget 2500 B gzipped
- Text: beta since 0.1.0, budget 2000 B gzipped
