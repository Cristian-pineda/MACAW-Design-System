# Roadmap and status

Last updated 2026-10-11. The original v1 plan is in the build-sequence section of the booklet _Building an Agentic Design System_; every decision taken since is in `DECISIONS.md` (#1–#22).

## Where v1 stands

**About 80% of the v1 plan is done.** The build work is essentially complete; the launch work (publishing, hosting, evals) has not started because it waits on an npm account.

| Step (booklet phase)                                                               | Status                                                                                                 | Done |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---- |
| 0. Environment (Node 24, pnpm via corepack)                                        | Done                                                                                                   | 100% |
| 1. Decisions written (`DECISIONS.md`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`) | Done                                                                                                   | 100% |
| 2. Repo and pipeline (monorepo, CI, Changesets, first `0.0.1` publish)             | CI runs on GitHub; `release` and visual baselines fixed in PR #6; first publish blocked on npm sign-up | 70%  |
| 3. Tokens (DTCG, three tiers, light/dark)                                          | Done, plus surface layers and compact density                                                          | 100% |
| 4. Foundations                                                                     | Done, plus Layout (grid, density, templates, containers)                                               | 100% |
| 5. Components (5 planned)                                                          | Done: 5 planned + Icon + 5 shell components                                                            | 100% |
| 6. Registry and CLI (`init`, `add`, `--eject`)                                     | Done; `diff` is a planned 0.2 placeholder                                                              | 100% |
| 7. Agent layer (plugin, hooks, reviewer, MCP)                                      | Done and tested; not yet exercised in a live Claude session in a consumer repo                         | 90%  |
| 8. Release 0.1.0 (publish, Vercel, first eval)                                     | Not started                                                                                            | 5%   |

| End-to-end check from the plan                                   | Status                                                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| A fresh app installs the packages and renders themed components  | Passes with packed tarballs in `tooling/smoke/consumer.sh`; the npm path waits on publishing |
| Claude, given only `macaw init`, builds the invoice summary eval | Not run yet (`evals/tasks/01-invoice-summary.md`)                                            |
| Eject writes source and `.macaw/ejected.json`                    | Passes (CLI tests)                                                                           |
| The `macaw` MCP server answers in a consumer repo                | Passes in-memory; live check waits on publishing                                             |
| Repo gates (`pnpm verify`, e2e, plugin validate)                 | Pass locally: 37 build tasks, 513 e2e tests                                                  |

## Built beyond the original plan

Roughly 60% more scope than the v1 plan, all decided in this session's consultations:

- Application shell as system components: AppShell, TopBar, SideNav, PageHeader, TabNav (#21)
- Surface layers for depth by tone (#17), compact density mode (#18), 12-column grid (#19)
- One mechanism each for motion and focus, enforced by lint and `manifest:check` (#20)
- Atomic levels, plus 4 templates and 3 pages installable with `macaw add` (#22)
- A WCAG 2.2 AA audit: focus retention, focus not obscured, reflow at 320 px, named regions, isolated previews; gated in CI
- Brand assets: favicon, app icons, social card, README logos

## Next, in order

1. **Merge PR #6** (CI fixes), then run the `e2e` workflow with _update-baselines_ and enable "Allow GitHub Actions to create and approve pull requests".
2. **Tidy Dependabot:** close #5, `@dependabot recreate` #1 for one grouped Actions PR, merge it when green.
3. **Branch protection on `main`:** require `ci` and `e2e`; no direct pushes from here on.
4. **npm:** create the account and the `macaw-ds` org, publish `0.0.1` by hand, add trusted publishers, then merge the "Version Packages" PR for `0.1.0`.
5. **Vercel:** connect `apps/docs`, set `REGISTRY_BASE_URL`, rebuild the registry so eject and shadcn URLs resolve.
6. **First eval:** run the invoice summary task with Claude in a fresh app; record corrections in `evals/README.md`.
7. **Screen reader pass:** VoiceOver on one component page and one page block.
8. **Make the repository public;** set the GitHub social preview.

## After 0.1.0

- Composed components the templates already need: data table (TanStack), select, dialog, form field, in-page tabs, toast, date and money inputs (`@internationalized/*`).
- Skills per domain: `building-forms`, `building-data-views`, `new-screen` (interview, SPEC.md, build, verify).
- `macaw diff` for ejected components.
- Three to five evals run on every release.
