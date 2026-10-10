# MACAW Design System (contributor rules)

This repo builds the system. Consumers get a different, shorter file from `plugin/templates/CLAUDE.md`.

## Always
- Tokens are the only source of colour, space, type, radius, shadow and motion. Edit `packages/tokens/src/*.json`; never `dist/`, never a hex or px in `packages/ui` or `apps/docs`.
- A component is six files in one folder: `x.manifest.json` first, then `x.tsx`, `x.test.tsx`, `x.examples.tsx`, `x.mdx`, `index.ts`. Then add it to `apps/docs/components/playground/component-map.tsx`.
- Public component props never include `className` or `style`. Variants are typed unions from `cva`; the manifest must match them (the test checks).
- Every interactive component: manifest `a11y` block filled in, axe in the unit test, keyboard path tested, focus style from `src/lib/focus.ts`.
- `registry/`, `plugin/skills/*/reference/`, `packages/manifest/schema/` and `packages/icons/src/generated/` are generated. Regenerate with `pnpm build`; never edit by hand.
- Any change under `packages/` needs `pnpm changeset`. Never bump versions by hand.
- Run `pnpm verify` before reporting done and show the output. If something is not in the system, say `not-in-system: <what>` and propose it in `DECISIONS.md` instead of improvising.

## Environment
- Node 24 via fnm (`.node-version`), pnpm via corepack. In a fresh shell: `eval "$(fnm env)"`.
- `pnpm dev` runs the docs site; `pnpm verify` runs lint, typecheck, tests, builds, manifest checks, registry and plugin builds, and bundle budgets.

## Where things live
- Decisions: `DECISIONS.md` (read before proposing anything). Setup and checklists: `CONTRIBUTING.md`.
- Component rules load from `.claude/rules/ui.md` when you touch `packages/ui`.
