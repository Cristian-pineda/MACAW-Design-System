# MACAW Design System

An **agentic design system for financial software**: tokens, React components, and the agent layer (manifests, skills, hooks, an MCP server) that lets Claude build correct screens with it without a human explaining it first.

MACAW targets dense, high-contrast, dashboard-first financial interfaces: tabular numerals at 7:1 contrast, 1px borders, tight radii, one restrained accent, light and dark as token modes.

> **Definition of done.** A new team installs `@macaw-ds/ui`, builds a working screen in a day without talking to us, and upgrades six months later without rewriting that screen.

## Status

Pre-release (`0.x`). The first usable release is `0.1.0`: tokens with light, dark and compact modes, Button, Text, Input, Badge, Card, the application shell (AppShell, TopBar, SideNav, PageHeader, TabNav), the CLI, the Claude Code plugin and the MCP server.

## Install (one door)

```bash
npx @macaw-ds/cli init
```

`init` installs `@macaw-ds/ui`, `@macaw-ds/tokens` and `@macaw-ds/icons`, drops the MACAW plugin (skills, hooks, reviewer agent, MCP config) into your repo's `.claude/` folder, and writes a short `CLAUDE.md` block, so Claude knows the system the moment the next session starts.

```bash
npx @macaw-ds/cli add button          # wires the import, prints a starter snippet
npx @macaw-ds/cli add button --eject  # copies the source in; recorded in .macaw/ejected.json
```

Then import the stylesheets once, in your root CSS:

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

Read `DECISIONS.md` before proposing a change; half of the answers are already there. `CONTRIBUTING.md` has the setup and the component checklist.

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
