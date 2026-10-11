<img src="https://raw.githubusercontent.com/Cristian-pineda/MACAW-Design-System/main/brand/macaw-logo-512.png" width="64" height="64" alt="MACAW logo">

# @macaw-ds/cli

The one door into the MACAW design system.

```bash
npx @macaw-ds/cli init                 # packages + Claude plugin (skills, hooks, reviewer agent, MCP)
npx @macaw-ds/cli add button           # wires the import, prints a starter snippet and the rules
npx @macaw-ds/cli add button --eject   # copies the source in; recorded in .macaw/ejected.json
npx @macaw-ds/cli diff button          # 0.2
```

The plugin and the registry ship inside this package, so `init` and `add` work offline and are always the same version as the components.
