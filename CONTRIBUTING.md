# Contributing

## Setup

```bash
brew install fnm && eval "$(fnm env)"   # or any Node version manager
fnm install 24 && fnm use 24            # .node-version pins 24
corepack enable                          # pnpm version comes from package.json
pnpm install
pnpm dev                                 # docs site at http://localhost:3000
```

## Scripts

| Script                | What it does                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`            | Runs the docs site (and watches packages)                                                                                                                                          |
| `pnpm build`          | Builds every package, the registry, the plugin reference files and the docs                                                                                                        |
| `pnpm verify`         | Lint, typecheck, unit tests, builds, manifest checks, registry and plugin builds, bundle budgets. Must pass before a PR.                                                           |
| `pnpm test:e2e`       | Playwright: axe on every page in both themes, keyboard paths, reflow at 320 px, focus not obscured, preview controls, and visual regression (visual runs on Linux only; see below) |
| `pnpm changeset`      | Records a change for the release train. Required for any change under `packages/`.                                                                                                 |
| `pnpm smoke:consumer` | Creates a fresh Next.js app in a temp dir and installs the packed packages                                                                                                         |

## Adding a component

1. Write `packages/ui/src/<slug>/<slug>.manifest.json` first. Fill in `purpose`, `props`, `a11y`, `rules`, `donts`, `tokens`, `examples`, `budget`.
2. Add component tokens in `packages/tokens/src/component/<slug>.json` if the component needs its own aliases. Rebuild tokens.
3. Implement `<slug>.tsx` with `cva` variants that match the manifest. No `className` or `style` on the public props. Use the shared focus style.
4. Write `<slug>.test.tsx`: every variant renders, axe passes, keyboard path works, `expectManifestMatchesVariants` passes.
5. Write `<slug>.examples.tsx` (named exports) and `<slug>.mdx` (when to use, when not, anatomy).
6. Export from `index.ts` and the package barrel; add the entry to `tsdown.config.ts` and `package.json` exports; add a `size-limit` entry.
7. Register the component in `apps/docs/components/playground/component-map.tsx`.
8. `pnpm verify`, then `pnpm changeset`.
9. Open a PR with screenshots (see below). For interactive components, complete the screen reader checklist in the PR template.

## Acceptance criteria

A PR that adds or changes a component, template or page is reviewed against these. The PR template repeats them as a checklist.

### Screenshots in the PR

Reviewers should be able to judge the change without checking out the branch. Attach to the PR description:

- The playground (or the block preview) in **light and dark**.
- **Before and after** for any change to something that already exists.
- **Compact density** if the component uses layout utilities (`p-card-x`, `h-control-*`, `gap-gutter`).
- A short screen recording for anything with motion or a multi-step keyboard path (menus, dialogs, tabs).

### Built from smaller components, no drift

- Compose what the system already has. If a part of your component looks or behaves like an existing component (a label, a badge, an icon button, a text style), import that component instead of rebuilding it with its classes.
- Stay on your atomic level or below (DECISIONS.md #22). `manifest:check` fails if an atom imports a molecule, for example.
- List what you compose in the manifest's `registryDependencies`, so `add` and `--eject` bring it along.
- No near-duplicates. If an existing component almost fits, extend it with a variant or prop (and propose it in `DECISIONS.md`) rather than shipping a second one.
- Tokens only. A new visual value is a token change in `packages/tokens/src`, never an inline value in the component.

The level check is automated; the "reused rather than rebuilt" part is not, so reviewers check it by reading the source.

### Documentation complete

Every component page on the docs site is built from the manifest, the `.mdx` and the examples, so a gap in any of them shows up as an empty section. Before review, open `/components/<slug>` and check each tab:

- **Overview:** playground controls cover every variant, `examples` include the realistic cases, and do / don't, rules and related components are filled in.
- **Usage:** the `.mdx` covers when to use, when not to use, and anatomy, plus a recipe if the component is usually composed with others.
- **Code:** import path, props (with descriptions and defaults) and slots match the source.
- **Accessibility:** the `a11y` block is complete: role, accessible name, every keyboard interaction, focus behaviour and notes. Text and non-text contrast meet **WCAG 2.2 AA** (4.5:1 text, 3:1 large text and UI parts) in light and dark; targets are at least 24×24 px; motion uses tokens and respects reduced motion (declare the `motion` block).

`pnpm verify` catches a missing manifest field or an empty keyboard list for interactive categories; it cannot tell whether the content is right.

## Visual regression baselines

The screenshots in `e2e/__screenshots__/` are Linux renders from the Playwright container, so visual tests run in CI and skip on macOS and Windows. When a change alters how something looks on purpose:

1. Push your branch and open the PR. The `e2e` check attaches the visual diffs as artifacts.
2. Actions → **e2e** → **Run workflow** on your branch with **update-baselines** ticked. It commits fresh screenshots to the branch.
3. Review the new PNGs in the PR diff before merging.

## Generated directories (never edit by hand)

`registry/`, `plugin/skills/using-macaw/reference/`, `packages/manifest/schema/`, `packages/icons/src/generated/`. They are committed so agents can read them without a build. CI fails if a rebuild changes them.

## Release train

Changesets opens a "Version Packages" PR on `main`. Merging it publishes every package at the same version. Support window: current major and the previous one. Breaking changes ship with a codemod and are announced one release ahead.

## Ejecting

`npx @macaw-ds/cli add <name> --eject` copies a component's source into a consumer repo and records it in `.macaw/ejected.json`. Ejected copies are outside the support window; `diff` (0.2) will show what they are behind.

## Code of conduct

Be kind, be specific, assume good intent. Report conduct issues to the maintainer listed in `NOTICE`.
