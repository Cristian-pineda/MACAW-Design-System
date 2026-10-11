---
'@macaw-ds/cli': patch
---

`macaw init` installs `eslint@^10` when the app has no ESLint, so the `verify` script and the lint hook it sets up work on a fresh app.
