# MACAW plugin

What Claude learns in a consuming repo. Installed by `npx @macaw-ds/cli init` (copied into `.claude/`), or directly as a Claude Code plugin:

```bash
claude plugin marketplace add Cristian-pineda/MACAW-Design-System
claude plugin install macaw@macaw
```

| Part                       | Purpose                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `templates/CLAUDE.md`      | The always-on rules, under 15 lines. The CLI writes it into the consumer's `CLAUDE.md`.    |
| `skills/using-macaw/`      | How to pick, compose and verify components. `reference/` is generated from the registry.   |
| `hooks/`                   | PreToolUse guard against editing installed packages; PostToolUse lint; Stop runs `verify`. |
| `agents/macaw-reviewer.md` | Fresh-context review against the manifests.                                                |
| `.mcp.json`                | The `macaw` MCP server: `list_components`, `get_component`, `get_tokens`, `validate`.      |
