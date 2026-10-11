# Decisions

Each entry is cheap now and expensive to reverse. Agents building components read this file as much as humans do. Add an entry before changing a contract; propose with the template at the bottom.

Format: number, title, status, date, context, decision, consequences.

---

## 1. Audience: financial software, dashboard-first

Status: accepted · 2026-10-10

Context. Consumer-facing and dashboard-focused systems disagree on density, type scale, motion and touch targets. MACAW's consumers build financial products: billing, ledgers, payments, analytics and the admin tools around them.

Decision. Dashboard-focused is primary. Consumer and marketing patterns are out of scope.

Consequences. Dense spacing, small type scale (11 to 30 px), tabular numerals by default in data, restrained motion. Marketing-site components will not be added.

## 2. Scope for v1

Status: accepted · 2026-10-10

In scope: analytics dashboards, financial tracking (tabular numerics, audit states), CRM-style admin and operations tooling.
Out of scope: marketing and content sites, native mobile, responsive-web-as-mobile.

## 3. Desktop-first, 1024 px floor

Status: accepted · 2026-10-10

Decision. Layouts are designed for 1024 px and above. Below the floor, content still reflows without horizontal scrolling down to 320 px, because WCAG 2.2 SC 1.4.10 (a 400% zoom on a laptop) requires it. The application shell stops being sticky, the side column stacks above the page, page header actions wrap, and the 12-column grid stacks to one column. Tables, when they exist, will collapse to cards. Below the floor the design is functional rather than tuned.

Consequences. Roughly a third less cost per component than fully responsive. Breakpoint tokens exist (`md` 1024, `lg` 1280, `xl` 1536) but components do not promise behaviour below `md`.

## 4. Single brand, light and dark as token modes

Status: accepted · 2026-10-10

Decision. One brand. Light and dark are modes of the semantic token layer, switched by `data-theme="light|dark"` on `<html>` or any element, with OS preference honoured when no attribute is set. Multi-brand is explicitly unsupported.

Consequences. Component code never branches on theme. Only semantic colour tokens differ between modes.

## 5. Stack

Status: accepted · 2026-10-10

Decision. React 19 + TypeScript. Tailwind v4 with CSS variables; variants through `class-variance-authority`. Headless behaviour from Radix (unified `radix-ui` package). Icons from Lucide, curated. Docs on Next.js (App Router).

Consequences. One framework supported well. Agents produce Tailwind-with-tokens reliably and lint can check it. Money and date inputs will build on `@internationalized/number` and `@internationalized/date`; tables on TanStack Table.

## 6. Delivery: package by default, eject recorded, one door

Status: accepted · 2026-10-10

Decision. Public npm packages under `@macaw-ds`. `npx @macaw-ds/cli init` is the only thing a consumer types; it installs the packages and the agent plugin. `add` wires imports. `add --eject` copies source and writes `.macaw/ejected.json` so forks are visible. A shadcn-compatible registry served by the docs site powers eject and `npx shadcn add <url>`.

Consequences. Ownership stays with the system unless a team ejects on purpose. We know who left the upgrade path.

## 7. Monorepo and lockstep versions

Status: accepted · 2026-10-10

Decision. pnpm workspaces + Turborepo. Changesets with a single fixed version group: every `@macaw-ds/*` package shares one version and one changelog.

Consequences. A tokens-only patch bumps every package. The CLI, the plugin, the registry and the MCP server are built from the same commit and can never disagree about what a version contains.

## 8. Accessibility: WCAG 2.2 AA, with named AAA exceptions

Status: accepted · 2026-10-10

Decision. WCAG 2.2 AA everywhere. Named exceptions above AA: 7:1 contrast for primary text and financial numerals (`fg.primary`, `fg.numeric`); no time limits on forms with legal weight (consumer rule, documented).

Consequences. Contrast is asserted in token tests in both themes. Every component manifest declares role, keyboard handling and accessible-name computation. axe runs in unit tests and in CI against every page in both themes; a keyboard test tabs through every gallery. A screen reader pass is required for new interactive components.

## 9. No `className`, no `style` on system components

Status: accepted · 2026-10-10

Decision. Public component props omit `className` and `style`. Escape hatches: `asChild` composition, `data-*` passthrough, and eject.

Consequences. The first override we allow is the last version we can change safely, so there are none. The consumer lint config flags `className` on MACAW components.

## 10. Tokens: DTCG JSON, three tiers, Style Dictionary

Status: accepted · 2026-10-10

Decision. Tokens are authored in W3C DTCG JSON in `packages/tokens/src` in three tiers: primitive (`color.neutral.600`), semantic (`color.action.primary`), component (`button.bg.primary`). Style Dictionary 5 generates CSS variables, a Tailwind `@theme inline` file, TypeScript constants and a metadata JSON.

Consequences. Components reference semantic tokens only; primitives are never referenced from `ui`. Rebranding is a change to the primitive tier.

## 11. Lint rules

Status: accepted · 2026-10-10

Decision. In `packages/ui` and in consumer repos: no raw hex, rgb or px in class strings or styles; no arbitrary Tailwind values (`bg-[...]`, `p-[...]`); Tailwind's default palette, radii, shadows and font sizes are disabled so only token utilities exist; `jsx-a11y` strict; no `className` on MACAW components.

Consequences. The only colours an agent can write are token classes. Typos fail lint.

## 12. No Storybook; manifest-driven playground

Status: accepted · 2026-10-10

Decision. The docs site's playground, generated from each component's manifest, is the showcase. Each component ships `*.examples.tsx` with named examples that the gallery renders and that can be converted to CSF stories later. Visual regression runs with Playwright against the gallery pages.

Consequences. One source (the manifest) feeds controls, docs, registry and the agent layer. `*.stories.tsx` is a reserved filename.

## 13. Docs-local controls are not system components

Status: accepted · 2026-10-10

Decision. The playground's own controls (segmented control, select, switch) live in `apps/docs/components/docs-ui` and are not exported. They are the first candidates for promotion into `@macaw-ds/ui`.

## 14. Toolchain pins

Status: accepted · 2026-10-10

Decision. Node 24 LTS (`.node-version`). pnpm 11 via corepack. TypeScript pinned to 5.9.x until typescript-eslint and dts tooling support TypeScript 7. ESLint 10 flat config. Vitest 5 with jsdom and jest-axe. tsdown with per-file output so `"use client"` directives survive.

## 15. Visual direction

Status: accepted · 2026-10-10

Decision. Dense, neutral cool-grey surfaces; one restrained blue-violet accent; success, warning, critical and info ramps with identical lightness steps; 1px borders; radii of 8 px or less; Inter for text, Geist Mono for code and optional numerals; tabular numerals in all data. MACAW borrows the discipline of dense financial dashboards under its own name, palette and assets.

## 16. The agent layer ships with the package

Status: accepted · 2026-10-10

Decision. Every component carries a schema-validated manifest. The plugin (`plugin/`) holds a `using-macaw` skill with generated reference files, hooks that lint after every edit and run `verify` before a turn ends, a fresh-context reviewer agent, and MCP config. `CLAUDE.md` in a consumer repo stays under 20 lines and points at the skill. `@macaw-ds/mcp` exposes `list_components`, `get_component`, `get_tokens` and `validate` over the generated registry.

Consequences. Context ships with the code. A rule in prose is advice; a rule in a hook, a type or a lint check is enforced.

## 17. Depth by tone: surface layers

Status: accepted · 2026-10-10 · replaces surface.default, surface.raised, surface.sunken

Context. Depth should read from colour alone, the way the docs separate the nav and header from the page. The old tokens did not do that in light mode: `surface.default` and `surface.raised` were the same white.

Decision. A layer scale: `surface.canvas` (the app background), `surface.layer-1` (nav, TopBar, cards), `surface.layer-2` and `surface.layer-3` (regions nested inside a layer), each with a `-hover` token, plus `surface.overlay` for floating UI and `surface.inverse`. In light, layer-1 is white on a shaded canvas and nested layers step darker. In dark, every step is lighter. The rule is tone first, border second, shadow last.

Consequences. Adjacent layers differ in tone in both themes, and the token tests assert it. Text, strong lines and the focus ring keep their contrast on every layer. The tokens are defined in Color; the concept is documented in Elevation.

## 18. Density as a token mode

Status: accepted · 2026-10-10

Context. Financial products range from a few cards to a wall of tables. One density is too loose for some and too tight for others.

Decision. `data-density="comfortable|compact"` on `<html>` or any region, built like the light and dark modes. Compact overrides control heights (28/32/40 to 24/28/32 px), the TopBar height (56 to 48 px), gutter (24 to 16 px), page margin (32 to 24 px), section and stack spacing, and card padding. Type sizes and badge sizes do not change. Components read the semantic tokens through utilities such as `h-control-md`, `p-card-x` and `gap-gutter`, so they adapt without props.

Consequences. A dense table can sit inside a comfortable page. Compact controls never go below the 24 px target size, and the tests assert it.

## 19. Layout grid and spacing base

Status: accepted · 2026-10-10

Decision. A 12-column page grid (`layout-grid`, column gap equals the gutter) with 24 px gutters comfortable and 16 px compact, and named content widths (`max-w-prose`, `max-w-form`, `max-w-page`, `max-w-wide`). Spacing stays on a 4 px base, with 2 px half-steps allowed inside components only. A 2 px base was rejected because it doubles the spacing choices without adding useful layouts.

Consequences. Twelve divides into 2, 3, 4 and 6, which suits KPI rows. Carbon-style 1 px condensed gutters can be added later if a tile wall needs them.

## 20. Motion and focus have one mechanism each

Status: accepted · 2026-10-10

Context. The playground's Show focus and Reduced motion toggles did nothing for most components. The spinner ignored the reduced-motion toggle, and Show focus forced an outline with CSS, which would hide a broken focus style.

Decision.

- Motion only through tokens: `duration-*`, `ease-*` and `animate-*`, where each named animation is a token. Reduced motion is `data-motion="reduced"` on any element, or the OS preference unless a scope sets `data-motion="full"`. Lint bans `motion-reduce:`, `motion-safe:`, raw durations and arbitrary motion values.
- Focus previews use the component's own style through the `force-focus:` variant, scoped by `data-force-focus`.
- Manifests declare `a11y.focusable` (true, false, or `{ whenProp }`) and `motion` when a component moves. The playground shows a control only when it applies.

Consequences. `manifest:check` fails if a component applies `focusRing` or motion utilities without the matching manifest field, or the reverse. The e2e suite checks that each preview control does what it claims.

## 21. Application shell components are part of the system

Status: accepted · 2026-10-10

Decision. `AppShell`, `TopBar`, `SideNav`, `PageHeader` and `TabNav` ship in `@macaw-ds/ui`, and the docs site uses them. `TabNav` is navigation: each tab is a URL, with links and `aria-current`. In-page panel switching is a separate Tabs component, not yet built. `AppShell` keeps window scrolling, a skip link and a full-height SideNav column.

Consequences. Every MACAW product gets the same frame and landmarks. Pages start with `PageHeader`, whose title is the page's `h1`.

## 22. Atomic levels: atoms, molecules, organisms, templates, pages

Status: accepted · 2026-10-10

Context. A flat list of components hides how they relate, and agents need to know which pieces are building blocks and which are whole screens.

Decision. Every component manifest declares `level`: atom (Text, Icon, Button, Input, Badge), molecule (Card, TabNav), organism (TopBar, SideNav, PageHeader) or template (AppShell). A component composes only components at its own level or below, and `manifest:check` enforces it. Templates (page structure with placeholder content) and pages (templates filled with realistic content) are **blocks**: compositions in the private `@macaw-ds/blocks` workspace, published as shadcn `registry:block` items. `npx @macaw-ds/cli add <slug>` copies a block, and a page brings its template. Blocks import components from `@macaw-ds/ui`, so the components stay on the upgrade path while the composition belongs to the consumer.

Consequences. The docs navigation, the components index, the registry, the MCP server and the agent skill all group by the same field. Blocks are never package exports, so they carry no semver obligations; they are starting points.

## 23. A base layer for the page

Status: proposed · 2026-10-11 · by Claude, from the first fresh-app install of 0.1.0

Context. MACAW sets no `html` or `body` styles. A fresh app with correct imports still renders on the framework's starter background in its starter font (create-next-app: `#ffffff`/`#0a0a0a` and Arial) until someone writes the base styles by hand, and agents improvise them with raw values. `init` now warns about the create-next-app starter block but does not delete user CSS.

Decision. `@macaw-ds/ui/styles.css` gains a small `@layer base` block: `html` gets `background-color: var(--color-surface-canvas)`, `color: var(--color-fg-primary)`, `font-family: var(--font-sans)`, `color-scheme` per theme, and font smoothing. No other element selectors and no resets beyond Tailwind's preflight. It ships in the stylesheet consumers already import, so there is no new import line.

Consequences. A page looks like MACAW as soon as `init` finishes. Because the block is layered, any unlayered rule in the app wins, so the create-next-app starter `body` rule still overrides it and `init` keeps the warning. Apps that mount MACAW in part of a page (an embedded widget, a micro-frontend) inherit page-level colours; they can opt out by not importing `styles.css` and compiling utilities themselves (see Getting started). Changing the base layer later is a visual change to every consumer, so it follows the same release rules as a token change.

## 24. Upgrades and health checks: `macaw upgrade` and `macaw doctor`

Status: proposed · 2026-10-11 · by Claude

Context. Decision 6 gives consumers one door in; nothing yet keeps them current. An install has several parts that must move together: the lockstep packages (decision 7), the agent files `init` copies into `.claude/`, the `CLAUDE.md` block, the MCP version pinned in `.mcp.json`, the root CSS block and any ejected components. Today a consumer who bumps `@macaw-ds/ui` alone gets new components with a stale skill and a stale MCP server, and nobody can tell from outside whether an install is healthy. CONTRIBUTING promises codemods for breaking changes, but there is no command to run them. `macaw diff` is a placeholder.

Decision.

- `init` records what it installed in `.macaw/install.json`: version, root CSS path, and which steps it skipped.
- `macaw doctor` is read-only and exits non-zero on errors, so it can run in CI or a Claude hook. Checks: all `@macaw-ds/*` packages on one version; installed versus the latest on npm; Tailwind v4; the CSS block present, in order and after the Tailwind import; starter styles overriding tokens; `.claude/` files, the `CLAUDE.md` block and the `.mcp.json` pin matching the installed version; hooks wired; ejected components behind upstream; imports of components whose manifest status is `deprecated`. `--json` for machines.
- `macaw upgrade` moves every `@macaw-ds/*` package to the newest version within the current major by default, re-runs the `init` steps to refresh the agent layer, the MCP pin and the CSS block, then runs `doctor` and the project's `verify`. It prints the plan first, applies it with `--yes`, and crosses a major only with `--major`, running that release's codemods.
- `macaw diff <name>` ships with it, comparing an ejected component with the version it came from and with the latest.
- The maintainer side enforces "non-breaking within a major": a CI check compares each component's manifest with the last published registry and fails a minor or patch changeset that removes or renames a prop, variant value or export.
- Docs give a Renovate and Dependabot group for `@macaw-ds/*`, so automated PRs bump every package together and run `doctor` in CI.

Consequences. Upgrading stays one command and keeps the agent layer in step with the code. `doctor` becomes the support answer to "is my install right?", and `using-macaw` tells Claude to run it when something looks off. The manifest-diff check makes semver a test rather than a promise. Cost: two CLI commands, a state file, and a CI job on our side. `install.json` must remain readable across majors.

---

## Proposal template

```
## N. <title>
Status: proposed · <date> · by <name or "Claude, in <consumer repo>">
Context. <what the consumer needed; link the issue or the not-in-system report>
Decision. <one of: no (reason) · recipe (who composes it) · new component or prop (RFC link)>
Consequences. <what changes for consumers and the maintainer>
```
