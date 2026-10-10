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

Decision. Layouts are designed for 1024 px and above. Below the floor, tables collapse to cards (when tables exist); nothing else adapts.

Consequences. Roughly a third less cost per component than fully responsive. Breakpoint tokens exist (`md` 1024, `lg` 1280, `xl` 1536) but components do not promise behaviour below `md`.

## 4. Single brand, light and dark as token modes

Status: accepted · 2026-10-10

Decision. One brand. Light and dark are modes of the semantic token layer, switched by `data-theme="light|dark"` on `<html>`, with OS preference honoured when no attribute is set. Multi-brand is explicitly unsupported.

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

---

## Proposal template

```
## N. <title>
Status: proposed · <date> · by <name or "Claude, in <consumer repo>">
Context. <what the consumer needed; link the issue or the not-in-system report>
Decision. <one of: no (reason) · recipe (who composes it) · new component or prop (RFC link)>
Consequences. <what changes for consumers and the maintainer>
```
