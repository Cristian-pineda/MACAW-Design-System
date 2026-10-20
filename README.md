<p align="center">
  <img src="brand/macaw-logo-512.png" width="128" height="128" alt="MACAW logo: a parrot inside a navy ring">
</p>

<h1 align="center">MACAW Design System</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@macaw-ds/ui"><img src="https://img.shields.io/npm/v/@macaw-ds/ui?label=%40macaw-ds%2Fui" alt="Current @macaw-ds/ui version on npm"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="License: Apache-2.0"></a>
  <a href="https://macaw-design-system.vercel.app"><img src="https://img.shields.io/badge/docs-macaw--design--system.vercel.app-black" alt="Docs site"></a>
</p>

An **agentic design system for financial software**: tokens, React components, and the agent layer (manifests, skills, hooks, an MCP server) that lets Claude build correct screens with it without a human explaining it first.

MACAW targets dense, high-contrast, dashboard-first financial interfaces: tabular numerals at 7:1 contrast, 1px borders, tight radii, one restrained accent, light and dark as token modes.

> **Definition of done.** A new team installs `@macaw-ds/ui`, builds a working screen in a day without talking to us, and upgrades six months later without rewriting that screen.

## Status

Pre-release (`0.x`): minor releases can still change the public API. The badge above shows the current version, and each package's `CHANGELOG.md` lists what changed.

What ships today: tokens with light, dark and compact modes; Button, Text, Input, Badge, Card; the application shell (AppShell, TopBar, SideNav, PageHeader, TabNav); templates and pages installable as blocks; the CLI (`init` now wires the stylesheet imports into your root CSS), the Claude Code plugin and the MCP server.

## Install (one door)

```bash
npx @macaw-ds/cli init
```

`init` installs `@macaw-ds/ui`, `@macaw-ds/tokens` and `@macaw-ds/icons`, drops the MACAW plugin (skills, hooks, reviewer agent, MCP config) into your repo's `.claude/` folder, and writes a short `CLAUDE.md` block, so Claude knows the system the moment the next session starts.

```bash
npx @macaw-ds/cli add button          # wires the import, prints a starter snippet
npx @macaw-ds/cli add button --eject  # copies the source in; recorded in .macaw/ejected.json
```

`init` also adds the stylesheet imports to your root CSS (`src/app/globals.css`, `src/index.css` and the other usual places), right after `@import 'tailwindcss'`, between `/* macaw:start */` markers. It needs Tailwind CSS v4 and stops on a v3 project. Pass `--no-css` to wire them yourself, in this order:

```css
@import 'tailwindcss';
@import '@macaw-ds/tokens/tokens.css';
@import '@macaw-ds/tokens/theme.css';
@import '@macaw-ds/ui/styles.css';
```

## What is in the box

| Package                   | Purpose                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `@macaw-ds/tokens`        | DTCG JSON tokens → CSS variables, Tailwind v4 theme, TypeScript constants              |
| `@macaw-ds/ui`            | Primitives and composed components on Radix, styled with token utilities only          |
| `@macaw-ds/icons`         | A curated Lucide subset behind `<Icon name />`                                         |
| `@macaw-ds/manifest`      | The component manifest schema and helpers                                              |
| `@macaw-ds/eslint-config` | The rules, as lint: no raw values, no `className` on system components                 |
| `@macaw-ds/cli`           | The one door: `init`, `add`, `add --eject`, `diff`                                     |
| `@macaw-ds/mcp`           | The same door for agents: `list_components`, `get_component`, `get_tokens`, `validate` |

Docs, playground and the component registry live in `apps/docs` and deploy to Vercel. The registry at `/r/<name>.json` is shadcn-compatible, so `npx shadcn add <url>` also works.

## Support and releases

- One release train for every package (lockstep versions via Changesets).
- Supported: the current major and the previous one.
- Breaking changes ship with a codemod and are announced one release ahead.

## Repository map

```
packages/   tokens · ui · icons · manifest · eslint-config · cli · mcp
plugin/     what Claude learns: skills, hooks, reviewer agent, MCP config, CLAUDE.md template
registry/   GENERATED from packages: index, manifests, eject sources, tokens
apps/docs/  Next.js docs, playground, registry endpoint
tooling/    build scripts for the registry, plugin reference files, manifest checks, smoke tests
evals/      "build me X" tasks run against each release
```

Status and next steps are in `ROADMAP.md`. Read `DECISIONS.md` before proposing a change; half of the answers are already there. `CONTRIBUTING.md` has the setup and the component checklist.

## Open source

MACAW is built in the open under Apache-2.0. Issues and pull requests are welcome:

- Read `DECISIONS.md` first; if something is missing from the system, propose it there rather than working around it.
- `CONTRIBUTING.md` has the setup (Node 24, pnpm via corepack), the six-file component checklist and the `pnpm verify` gate every change passes.
- Changes under `packages/` need a changeset (`pnpm changeset`); versions are never bumped by hand.

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
