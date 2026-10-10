# Agent instructions (vendor-neutral)

MACAW is an agentic design system for financial software. The rules below apply to any coding agent working in this repository. Claude Code additionally loads `CLAUDE.md`, `.claude/rules/`, `.claude/settings.json` hooks and the `plugin/` directory.

1. Tokens only. Colour, space, type, radius, shadow and motion come from `packages/tokens/src`. No hex, rgb or px in `packages/ui` or `apps/docs`; no arbitrary Tailwind values.
2. One component, one folder, six files: manifest (`*.manifest.json`, schema in `packages/manifest/schema/manifest.schema.json`), implementation, test (axe + keyboard + manifest parity), examples, MDX, index. Manifest first.
3. No `className` or `style` on public component props. Escape hatches are `asChild`, `data-*`, and eject.
4. Generated directories (`registry/`, `plugin/skills/*/reference/`, `packages/manifest/schema/`, `packages/icons/src/generated/`) are never edited by hand.
5. Any change under `packages/` needs a changeset (`pnpm changeset`).
6. `pnpm verify` must pass before work is reported as done. Show its output.
7. If a request needs something the system lacks, stop and report `not-in-system: <what>`; propose it in `DECISIONS.md`.

Consumer-side agent assets (what `npx @macaw-ds/cli init` installs into another repo) live in `plugin/`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
