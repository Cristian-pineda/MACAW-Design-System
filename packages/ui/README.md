<img src="https://raw.githubusercontent.com/Cristian-pineda/MACAW-Design-System/main/brand/macaw-logo-512.png" width="64" height="64" alt="MACAW logo">

# @macaw-ds/ui

MACAW React components. Primitives on Radix, styled with token utilities only, no `className` or `style` on public props. Each component folder carries its manifest (the contract), tests, examples and docs.

```tsx
import { Button, Text } from '@macaw-ds/ui';

<Button variant="primary">Pay invoice</Button>
<Text numeric>$12,480.00</Text>
```

Setup: `npx @macaw-ds/cli init` installs the packages and adds the stylesheet imports to your root CSS. By hand, import `@macaw-ds/ui/styles.css` once, after the token files.
