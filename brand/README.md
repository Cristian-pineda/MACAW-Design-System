# MACAW brand

| File                 | Use                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `macaw-logo.png`     | **Master.** 3600×3600, transparent. Replace this file to change the logo, then run `pnpm brand:build`. |
| `macaw-mark.png`     | 1024×1024 tight crop around the ring, transparent. Source for every icon. Generated.                   |
| `macaw-logo-512.png` | 512×512 full logo for READMEs. Generated.                                                              |

`pnpm brand:build` (`tooling/brand/build.ts`) regenerates every derived asset and writes them where they are used:

| Output                                                                         | Where it shows up                                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `apps/docs/app/favicon.ico` (16, 32, 48)                                       | Browser tabs, bookmarks, legacy `/favicon.ico` requests                                                            |
| `apps/docs/app/icon.png` (512)                                                 | Modern browser tab icon                                                                                            |
| `apps/docs/app/apple-icon.png` (180, on white)                                 | iOS home screen and Safari pinned tabs; iOS fills transparency with black, so it is opaque                         |
| `apps/docs/public/brand/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Web app manifest: install prompts and Android launchers; the maskable icon keeps the mark inside the 80% safe zone |
| `apps/docs/public/brand/macaw-avatar.png` (128)                                | Docs TopBar avatar                                                                                                 |
| `apps/docs/public/brand/macaw-mark-512.png`                                    | Docs home hero and the social preview card (`app/opengraph-image.tsx`)                                             |

## Usage

- The mark is a parrot inside a navy ring on transparency. Place it on white or on MACAW surface layers; do not put it on a busy image.
- Keep clear space of at least a quarter of the mark's width on every side.
- Minimum size 16 px (favicon). Below 24 px in product UI, prefer the wordmark "MACAW" in `Text variant="heading-md"`.
- Do not recolour, rotate, stretch or add effects.
- When the mark sits next to the word MACAW, it is decorative (`alt=""`). On its own, its alternative text is "MACAW".
- The logo is not part of the token system and never appears inside components; products that use MACAW ship their own brand.

## Manual places

- **GitHub social preview:** Settings → General → Social preview → upload a 1280×640 export of the docs card (`/opengraph-image` on the deployed site).
- **npm:** package pages show the README image once the repository is public (raw GitHub URLs do not resolve for private repos).
