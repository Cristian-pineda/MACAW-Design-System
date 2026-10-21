## What

<!-- One or two sentences. Link the DECISIONS.md entry or the not-in-system report if this adds surface area. -->

## Checklist

- [ ] `pnpm verify` passes locally (paste the last lines below)
- [ ] Changeset added (`pnpm changeset`) for any change under `packages/`
- [ ] Manifest updated and matches the `cva` variants

### Screenshots (required for any UI change)

<!-- Playground or block preview, light and dark. Before/after when changing something that exists. Compact density if layout utilities are used. A short recording for motion or multi-step keyboard paths. -->

| Light | Dark |
| ----- | ---- |
|       |      |

### Composition (required for new or changed components)

- [ ] Built from existing components where they fit; nothing re-implemented with their classes
- [ ] Stays at its atomic level or below; composed components listed in `registryDependencies`
- [ ] No near-duplicate of an existing component (extend it instead, with a `DECISIONS.md` proposal)

### Documentation (required for new or changed components)

- [ ] Overview: playground covers every variant; examples, do / don't, rules and related filled in
- [ ] Usage: when to use, when not, anatomy
- [ ] Code: props, defaults and slots match the source
- [ ] Accessibility tab: role, name, keyboard, focus and notes complete; contrast meets WCAG 2.2 AA in light and dark

### Accessibility (required for new or changed interactive components)

- [ ] axe passes in unit tests for every variant and state, light and dark
- [ ] Keyboard path tested (Tab order, Enter/Space, Escape where relevant)
- [ ] Focus ring visible; target size at least 24×24 px
- [ ] Screen reader pass: VoiceOver with Safari and Chrome (name, role, state announced)

## Verify output

```
<!-- paste -->
```
