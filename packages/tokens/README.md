<img src="https://raw.githubusercontent.com/Cristian-pineda/MACAW-Design-System/main/brand/macaw-logo-512.png" width="64" height="64" alt="MACAW logo">

# @macaw-ds/tokens

Design tokens for the MACAW design system, authored in W3C DTCG JSON (`src/`) and compiled to:

- `tokens.css`: `--macaw-*` CSS variables for light (`:root`) and dark (`[data-theme="dark"]`, plus OS preference)
- `theme.css`: a Tailwind v4 `@theme inline` file so utilities like `bg-action-primary` map to the variables
- `tokens.js` / `tokens.d.ts`: typed constants (`tokens.color.action.primary` is `"var(--macaw-color-action-primary)"`)
- `tokens.meta.json`: every token with its light and dark values, tier and description

```css
@import 'tailwindcss';
@import '@macaw-ds/tokens/tokens.css';
@import '@macaw-ds/tokens/theme.css';
```

Three tiers: primitive (`color.neutral.600`), semantic (`color.action.primary`), component (`button.bg.primary`). Components reference semantic tokens only.
