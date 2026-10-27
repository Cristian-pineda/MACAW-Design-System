# @macaw-ds/cli

## 0.2.2

### Patch Changes

- Updated dependencies []:
  - @macaw-ds/manifest@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies []:
  - @macaw-ds/manifest@0.2.1

## 0.2.0

### Minor Changes

- [#15](https://github.com/Cristian-pineda/MACAW-Design-System/pull/15) [`56db594`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/56db594a57f47e00adc94a38c77f34916a4e0725) Thanks [@Cristian-pineda](https://github.com/Cristian-pineda)! - `macaw init` adds the MACAW stylesheet imports to your root CSS (after the Tailwind import, between `/* macaw:start */` and `/* macaw:end */`), stops with a clear message on Tailwind CSS v3 projects, and flags create-next-app starter styles that override the tokens. Pass `--no-css` to keep wiring the imports yourself.

### Patch Changes

- [#13](https://github.com/Cristian-pineda/MACAW-Design-System/pull/13) [`54a02ab`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/54a02ab5d488237a223765811dca1e8cb2f6bea6) Thanks [@Cristian-pineda](https://github.com/Cristian-pineda)! - `macaw init` installs `eslint@^10` when the app has no ESLint, so the `verify` script and the lint hook it sets up work on a fresh app.
- Updated dependencies []:
  - @macaw-ds/manifest@0.2.0

## 0.1.0

### Minor Changes

- [`d6c9380`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/d6c9380f465fcd5c322300d0c7a2926446d957a4) - First usable release: DTCG tokens with light and dark modes, surface layers and a compact density mode; Text, Button, Input, Badge and Card; the application shell (AppShell, TopBar, SideNav, PageHeader, TabNav); components grouped by atomic level, with templates and pages installable as blocks (`macaw add dashboard-template`); the curated Icon set, the manifest contract, the lint rules, the CLI (`init`, `add`, `add --eject`) and the MCP server (`list_components`, `get_component`, `get_tokens`, `validate`).

### Patch Changes

- Updated dependencies [[`d6c9380`](https://github.com/Cristian-pineda/MACAW-Design-System/commit/d6c9380f465fcd5c322300d0c7a2926446d957a4)]:
  - @macaw-ds/manifest@0.1.0
