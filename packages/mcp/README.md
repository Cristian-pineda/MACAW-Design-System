# @macaw-ds/mcp

The agents' door into the MACAW design system. A stdio MCP server over the generated registry:

| Tool                        | Returns                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `list_components`           | Every component with purpose, status, exports and budget                       |
| `get_component(name)`       | The full manifest (props, a11y, rules, dos, donts, examples), or `notInSystem` |
| `get_tokens(group?, tier?)` | Tokens with light and dark values and the Tailwind utility to use              |
| `validate(code)`            | MACAW lint results plus `notInSystem` and `unknownComponents` for a snippet    |

`npx @macaw-ds/cli init` adds it to `.mcp.json`. Manually: `{ "mcpServers": { "macaw": { "command": "npx", "args": ["-y", "@macaw-ds/mcp"] } } }`.
