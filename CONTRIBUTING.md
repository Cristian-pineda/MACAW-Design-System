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

| Script                | What it does                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`            | Runs the docs site (and watches packages)                                                                                |
| `pnpm build`          | Builds every package, the registry, the plugin reference files and the docs                                              |
| `pnpm verify`         | Lint, typecheck, unit tests, builds, manifest checks, registry and plugin builds, bundle budgets. Must pass before a PR. |
| `pnpm test:e2e`       | Playwright: axe on every page, keyboard paths, visual regression (CI generates baselines in the Playwright container)    |
| `pnpm changeset`      | Records a change for the release train. Required for any change under `packages/`.                                       |
| `pnpm smoke:consumer` | Creates a fresh Next.js app in a temp dir and installs the packed packages                                               |

## Adding a component

1. Write `packages/ui/src/<slug>/<slug>.manifest.json` first. Fill in `purpose`, `props`, `a11y`, `rules`, `donts`, `tokens`, `examples`, `budget`.
2. Add component tokens in `packages/tokens/src/component/<slug>.json` if the component needs its own aliases. Rebuild tokens.
3. Implement `<slug>.tsx` with `cva` variants that match the manifest. No `className` or `style` on the public props. Use the shared focus style.
4. Write `<slug>.test.tsx`: every variant renders, axe passes, keyboard path works, `expectManifestMatchesVariants` passes.
5. Write `<slug>.examples.tsx` (named exports) and `<slug>.mdx` (when to use, when not, anatomy).
6. Export from `index.ts` and the package barrel; add the entry to `tsdown.config.ts` and `package.json` exports; add a `size-limit` entry.
7. Register the component in `apps/docs/components/playground/component-map.tsx`.
8. `pnpm verify`, then `pnpm changeset`.
9. Open a PR with a screenshot of the playground. For interactive components, complete the screen reader checklist in the PR template.

## Generated directories (never edit by hand)

`registry/`, `plugin/skills/using-macaw/reference/`, `packages/manifest/schema/`, `packages/icons/src/generated/`. They are committed so agents can read them without a build. CI fails if a rebuild changes them.

## Release train

Changesets opens a "Version Packages" PR on `main`. Merging it publishes every package at the same version. Support window: current major and the previous one. Breaking changes ship with a codemod and are announced one release ahead.

## Ejecting

`npx @macaw-ds/cli add <name> --eject` copies a component's source into a consumer repo and records it in `.macaw/ejected.json`. Ejected copies are outside the support window; `diff` (0.2) will show what they are behind.

## Code of conduct

Be kind, be specific, assume good intent. Report conduct issues to the maintainer listed in `NOTICE`.
