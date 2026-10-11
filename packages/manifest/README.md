<img src="https://raw.githubusercontent.com/Cristian-pineda/MACAW-Design-System/main/brand/macaw-logo-512.png" width="64" height="64" alt="MACAW logo">

# @macaw-ds/manifest

The contract every MACAW component ships with, as a Zod schema plus helpers:

- `ManifestSchema`, `parseManifest(json)`: validate a `*.manifest.json`
- `loadManifests(files)` from `@macaw-ds/manifest/node`: read and validate many (Node only)
- `buildJsxSnippet(manifest, props)`: the JSX the playground shows and the CLI prints
- `inferControl(prop)`: which playground control a prop gets
- `schema/manifest.schema.json`: the same contract as JSON Schema, for editors and agents
