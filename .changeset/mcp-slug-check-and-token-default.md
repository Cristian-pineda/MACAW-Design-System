---
'@macaw-ds/mcp': patch
---

`get_component` now rejects names that are not plain slugs (`[a-z0-9-]`) before reading anything from disk, instead of building a file path from the raw input. `get_tokens` with no `group` and no `tier` returns the semantic tier only (what screens are built from) rather than every token in the system, and the response names the tier it returned; pass `tier` or `group` to see primitives and component tokens.
