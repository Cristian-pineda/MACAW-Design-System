# Evals

"Build me X" tasks run against each release (booklet §11). The metric that matters is **corrections**: how many plain-language adjustments a human had to make after Claude's first pass. Record each run in the table.

## How to run

1. Create a fresh consumer app: `pnpm smoke:consumer --keep` prints the path.
2. In that app: `npx @macaw-ds/cli init` (or `node <repo>/packages/cli/dist/index.js init` for an unreleased build).
3. `claude -p "$(cat evals/tasks/01-invoice-summary.md)"` from the consumer app, or paste the task into an interactive session.
4. Check: `pnpm verify` exits 0; `grep -rn "className=" src | grep -E "<(Button|Text|Input|Badge|Card)"` is empty; exactly one `variant="primary"` (or default) Button on the screen; a screenshot was produced.
5. Record the run below.

| Date | Version | Task | Verify | Corrections | Notes |
| ---- | ------- | ---- | ------ | ----------- | ----- |
|      |         |      |        |             |       |
