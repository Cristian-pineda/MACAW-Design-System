# @macaw-ds/mcp

## 0.2.1

### Patch Changes

- [#18](https://github.com/Cristian-pineda/MACAW-Design-System/pull/18) [`4a22192`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/4a22192f91d97c9432c4298d995de8012c13798b) Thanks [@Cristian-pineda](https://github.com/Cristian-pineda)! - `get_component` now rejects names that are not plain slugs (`[a-z0-9-]`) before reading anything from disk, instead of building a file path from the raw input. `get_tokens` with no `group` and no `tier` returns the semantic tier only (what screens are built from) rather than every token in the system, and the response names the tier it returned; pass `tier` or `group` to see primitives and component tokens.
- Updated dependencies []:
  - @macaw-ds/eslint-config@0.2.1
  - @macaw-ds/tokens@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies []:
  - @macaw-ds/eslint-config@0.2.0
  - @macaw-ds/tokens@0.2.0

## 0.1.0

### Minor Changes

- [`d6c9380`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/d6c9380f465fcd5c322300d0c7a2926446d957a4) - First usable release: DTCG tokens with light and dark modes, surface layers and a compact density mode; Text, Button, Input, Badge and Card; the application shell (AppShell, TopBar, SideNav, PageHeader, TabNav); components grouped by atomic level, with templates and pages installable as blocks (`macaw add dashboard-template`); the curated Icon set, the manifest contract, the lint rules, the CLI (`init`, `add`, `add --eject`) and the MCP server (`list_components`, `get_component`, `get_tokens`, `validate`).

### Patch Changes

- Updated dependencies [[`d6c9380`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/d6c9380f465fcd5c322300d0c7a2926446d957a4)]:
  - @macaw-ds/tokens@0.1.0
  - @macaw-ds/eslint-config@0.1.0
