# @macaw-ds/manifest

The contract every MACAW component ships with, as a Zod schema plus helpers:

- `ManifestSchema`, `parseManifest(json)`: validate a `*.manifest.json`
- `loadManifests(files)`: read and validate many
- `buildJsxSnippet(manifest, props)`: the JSX the playground shows and the CLI prints
- `inferControl(prop)`: which playground control a prop gets
- `schema/manifest.schema.json`: the same contract as JSON Schema, for editors and agents
