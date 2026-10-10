<!-- macaw:start -->

# MACAW design system

- UI comes from @macaw-ds/ui only (Icon from @macaw-ds/icons). Never write a component that exists there; read the `using-macaw` skill first.
- Colours, spacing, type, radius, shadow, motion: MACAW token utilities only (bg-action-primary, p-4, text-body-md, rounded-control). Never hex, never px, never bg-[...], never Tailwind's default palette.
- Never pass className or style to a MACAW component. Variants are typed props. If a variant is missing, stop and propose it; do not work around it.
- Every string goes through <Text>. Money, counts and dates use <Text numeric>. Every <Input> has a visible label.
- Light and dark are token modes; never branch on theme in component code.
- Run the project's verify script (pnpm verify or npm run verify) before reporting done and show the output.
- If a request needs something not in the system, stop and say `not-in-system: <what>` instead of improvising.
- Details live in the using-macaw skill; the component manifests are the contract. Ask the macaw MCP server (`validate`) when unsure.

<!-- macaw:end -->
