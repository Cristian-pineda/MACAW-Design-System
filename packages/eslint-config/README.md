# @macaw-ds/eslint-config

The MACAW rules, as lint. Flat config for ESLint 10.

```js
// eslint.config.js (consumer)
import macaw from '@macaw-ds/eslint-config';
export default [...macaw({ tailwindEntry: 'app/globals.css' })];
```

Rules added on top of `@eslint/js`, `typescript-eslint`, `react-hooks` and strict `jsx-a11y`:

- `macaw/no-raw-values`: no hex, rgb/oklch or px literals in `className`, `cva()`/`cn()` or inline styles.
- `macaw/no-classname-on-macaw`: no `className` or `style` on components imported from `@macaw-ds/ui`.
- `better-tailwindcss/no-restricted-classes`: no arbitrary values (`bg-[#fff]`, `p-[13px]`) and no Tailwind default palette.
- `better-tailwindcss/no-unknown-classes` (when `tailwindEntry` is set): typos such as `bg-action-primry` fail.
