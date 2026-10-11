---
'@macaw-ds/cli': minor
---

`macaw init` adds the MACAW stylesheet imports to your root CSS (after the Tailwind import, between `/* macaw:start */` and `/* macaw:end */`), stops with a clear message on Tailwind CSS v3 projects, and flags create-next-app starter styles that override the tokens. Pass `--no-css` to keep wiring the imports yourself.
