## What

<!-- One or two sentences. Link the DECISIONS.md entry or the not-in-system report if this adds surface area. -->

## Checklist

- [ ] `pnpm verify` passes locally (paste the last lines below)
- [ ] Changeset added (`pnpm changeset`) for any change under `packages/`
- [ ] Manifest updated and matches the `cva` variants
- [ ] Playground screenshot attached for any UI change

### Accessibility (required for new or changed interactive components)

- [ ] axe passes in unit tests for every variant and state, light and dark
- [ ] Keyboard path tested (Tab order, Enter/Space, Escape where relevant)
- [ ] Focus ring visible; target size at least 24×24 px
- [ ] Screen reader pass: VoiceOver with Safari and Chrome (name, role, state announced)

## Verify output

```
<!-- paste -->
```
