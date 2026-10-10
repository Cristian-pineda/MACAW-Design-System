---
paths:
  - 'packages/ui/**'
  - 'packages/icons/**'
---

# Component rules (packages/ui, packages/icons)

- Manifest first. The `cva` variants must match `props` in the manifest; the unit test enforces it.
- Public props: `Omit<React.ComponentPropsWithoutRef<'el'>, 'className' | 'style' | 'color'>` plus `VariantProps`. Never expose `className` or `style`.
- Class strings use token utilities only: `bg-action-primary`, `text-fg-muted`, `border-line-default`, `rounded-md`, `text-body-md`, `p-4`. Never `bg-[#...]`, never `h-[37px]`, never Tailwind default colours.
- Focus: import `focusRing` from `../lib/focus` and include it in the base class list of every interactive component.
- Accessibility: every interactive variant must render with no axe violations; keyboard activation is tested; icon-only controls require `aria-label` at the type level.
- `"use client"` only when the file uses hooks, refs or interactive Radix parts. `scripts/check-dist.mjs` verifies the directive survives the build.
- Tests: `render` from `../lib/test-utils`, `axe(container)`, `userEvent`, and `expectManifestMatchesVariants(manifest, variants)`.
- Examples: `*.examples.tsx` exports named React components with no props; the gallery renders them all.
- Manifest `a11y.focusable` must match the source: true (or `{ whenProp }`) exactly when the component applies `focusRing`. `manifest:check` enforces it.
- Motion only through tokens (`duration-*`, `ease-*`, `animate-spin`); declare a `motion` block in the manifest whenever the source uses them. Never `motion-reduce:`, `motion-safe:` or raw durations.
- Backgrounds use surface layers (`bg-surface-layer-1`, `-2`, `-3`, `-hover`), never hand-picked neutrals. Spacing that should follow density uses the layout utilities (`p-card-x`, `gap-gutter`, `px-margin`, `h-control-*`).
- Compound parts are exported twice: `Card.Header` for client code and `CardHeader` for React Server Components.
