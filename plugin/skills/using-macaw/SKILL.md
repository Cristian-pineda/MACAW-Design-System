---
name: using-macaw
description: Pick, compose and verify MACAW design-system components (@macaw-ds/ui). Use whenever building or editing React UI in a repo that depends on @macaw-ds/ui, before writing any JSX.
---

# Using MACAW

MACAW is an agentic design system for financial software. The manifests in `reference/manifests/` are the contract: read the manifest for every component you use before you use it.

## Workflow

1. Open `reference/components.md` and choose components by `purpose`. If what you need is not there, stop and report `not-in-system: <what>` with one sentence on what it would do. Do not build a substitute from divs.
2. Open `reference/manifests/<slug>.json` for each component you will use. Follow `rules`, respect `donts`, and copy from `examples`.
3. Compose with token utilities only. `reference/tokens.md` lists them. Spacing is the 4px scale (`gap-2`, `p-4`); colours are semantic (`bg-surface-default`, `text-fg-muted`, `border-line-default`); type is `text-<variant>` through `<Text>`.
4. After each edit, lint the file (the post-edit hook does this). Before reporting done, run `pnpm verify` (or `npm run verify`) and show the output.
5. If the `macaw` MCP server is connected, call `validate` with the file's contents before finishing. It returns lint messages and `not-in-system` for unknown components.

## Setup checklist (first use in a repo)

- `npx @macaw-ds/cli init` has run: packages installed, this skill present, hooks in `.claude/settings.json`.
- Root CSS imports, in this order: `@import "tailwindcss"; @import "@macaw-ds/tokens/tokens.css"; @import "@macaw-ds/tokens/theme.css"; @import "@macaw-ds/ui/styles.css";`
- `<html data-theme="light">` (or `"dark"`, or omit to follow the OS). Fonts: Inter and Geist Mono via `next/font/google`, or the system stack falls back.

## Recipes

**Form row**

```tsx
<div className="flex flex-col gap-1">
  <Text as="label" variant="label-sm" htmlFor="amount">
    Amount (USD)
  </Text>
  <Input
    id="amount"
    align="end"
    inputMode="decimal"
    startAdornment="$"
    endAdornment="USD"
    aria-describedby="amount-help"
  />
  <Text id="amount-help" variant="caption" tone="muted">
    Charged on the 1st of each month.
  </Text>
</div>
```

**KPI card**

```tsx
<Card padding="sm">
  <Card.Body>
    <Text variant="label-sm" tone="secondary">
      Gross volume
    </Text>
    <Text variant="numeric-lg" numeric>
      $128,430.00
    </Text>
    <Text variant="caption" tone="success">
      +12.4% vs previous period
    </Text>
  </Card.Body>
</Card>
```

**Action bar** (one primary, the rest secondary or ghost, primary last)

```tsx
<div className="flex items-center justify-end gap-2">
  <Button variant="ghost">Cancel</Button>
  <Button variant="secondary">Save draft</Button>
  <Button>Send invoice</Button>
</div>
```

**Status in a row**: `<Badge tone="critical">Overdue</Badge>` next to `<Text numeric align="end">$4,200.00</Text>`.

## Rules that are easy to miss

- One `variant="primary"` Button per view.
- Icon-only buttons: `iconOnly` plus `aria-label`.
- Every Input has `id` with a `<Text as="label" htmlFor>` (or `aria-label` for a search box). `invalid` always comes with a message linked by `aria-describedby`.
- Heading levels descend without skipping; set `as` on `Text` and `Card.Title`.
- Never signal state by colour alone; the word carries the meaning.
- Interactive cards use `asChild` with an anchor or button and contain no other interactive elements.

## Reporting

"Done" means: `verify` passed (paste the tail), which components were used, and any `not-in-system` gaps listed for the maintainer. Propose missing variants or components as a `DECISIONS.md` entry in the system repo rather than working around them.

## Not in the system yet

Tables, select, dialog, tooltip, popover, tabs, toast, date picker, number or money input, textarea, checkbox, radio, switch, dropdown menu, command palette, app shell. Report `not-in-system` for these.
