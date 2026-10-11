# @macaw-ds/blocks (private)

Templates and pages: compositions of MACAW components that `npx @macaw-ds/cli add <slug>` copies into a repo as a starting point. They import components from `@macaw-ds/ui`, so the components stay on the upgrade path while the composition belongs to the consumer.

Each block is a folder `src/<slug>/` with:

- `<slug>.tsx`: the composition, using MACAW components and token utilities only
- `<slug>.block.json`: the block manifest (schema: `packages/manifest/schema/block.schema.json`)
- `<slug>.test.tsx`: renders, landmarks and headings, axe in both themes

Templates take slot props with placeholder defaults. Pages import their template and fill it with realistic content.
