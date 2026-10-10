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
