/**
 * Derives every logo asset from the master in brand/macaw-logo.png (3600×3600, transparent).
 * Run after replacing the master: pnpm brand:build. Outputs are committed, so CI never needs it.
 *
 *   brand/macaw-mark.png              1024² tight crop on transparent (the source for icons)
 *   brand/macaw-logo-512.png          512² full logo for READMEs
 *   apps/docs/app/icon.png            512² favicon for modern browsers (Next file convention)
 *   apps/docs/app/favicon.ico         16/32/48 for legacy /favicon.ico requests
 *   apps/docs/app/apple-icon.png      180² on an opaque background (iOS fills transparency with black)
 *   apps/docs/public/brand/*.png      avatar, manifest icons (192/512) and a maskable 512
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { ROOT } from '../lib.ts';

const MASTER = join(ROOT, 'brand/macaw-logo.png');
const DOCS_APP = join(ROOT, 'apps/docs/app');
const DOCS_PUBLIC = join(ROOT, 'apps/docs/public/brand');
// Opaque backgrounds: MACAW neutral.0 (white) and the logo's own navy ring colour for contrast.
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

await mkdir(DOCS_PUBLIC, { recursive: true });

// 1. The mark: a square crop around the opaque artwork with a 3% margin.
const { info } = await sharp(MASTER).raw().toBuffer({ resolveWithObject: true });
const trimmed = await sharp(MASTER).trim({ threshold: 8 }).toBuffer({ resolveWithObject: true });
const {
  width: tw,
  height: th,
  trimOffsetLeft = 0,
  trimOffsetTop = 0,
} = trimmed.info as sharp.OutputInfo & {
  trimOffsetLeft?: number;
  trimOffsetTop?: number;
};
const side = Math.round(Math.max(tw, th) * 1.06);
const cx = -trimOffsetLeft + tw / 2;
const cy = -trimOffsetTop + th / 2;
const left = Math.max(0, Math.round(cx - side / 2));
const top = Math.max(0, Math.round(cy - side / 2));
const size = Math.min(side, info.width - left, info.height - top);
const mark = await sharp(MASTER).extract({ left, top, width: size, height: size }).png().toBuffer();

const png = (input: Buffer, px: number) =>
  sharp(input)
    .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();

/** The mark scaled to `inner` px and centred on an opaque `px` square. */
const onBackground = async (px: number, inner: number) =>
  sharp({ create: { width: px, height: px, channels: 4, background: WHITE } })
    .composite([{ input: await png(mark, inner), gravity: 'centre' }])
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toBuffer();

const outputs: Array<[string, Buffer]> = [
  [join(ROOT, 'brand/macaw-mark.png'), await png(mark, 1024)],
  [join(ROOT, 'brand/macaw-logo-512.png'), await png(await sharp(MASTER).png().toBuffer(), 512)],
  [join(DOCS_APP, 'icon.png'), await png(mark, 512)],
  [join(DOCS_APP, 'apple-icon.png'), await onBackground(180, 148)],
  [join(DOCS_PUBLIC, 'macaw-avatar.png'), await png(mark, 128)],
  [join(DOCS_PUBLIC, 'macaw-mark-512.png'), await png(mark, 512)],
  [join(DOCS_PUBLIC, 'icon-192.png'), await png(mark, 192)],
  [join(DOCS_PUBLIC, 'icon-512.png'), await png(mark, 512)],
  // Maskable: launchers crop to a circle or squircle inside an 80% safe zone.
  [join(DOCS_PUBLIC, 'icon-maskable-512.png'), await onBackground(512, 384)],
];

// favicon.ico: an ICO container holding PNG images (supported by every current browser).
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => png(mark, s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
let offset = 6 + 16 * icoSizes.length;
const entries = icoImages.map((img, i) => {
  const e = Buffer.alloc(16);
  const s = icoSizes[i]!;
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(img.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
outputs.push([join(DOCS_APP, 'favicon.ico'), Buffer.concat([header, ...entries, ...icoImages])]);

for (const [file, buf] of outputs) await writeFile(file, buf);
console.log(
  `brand:build: crop ${size}px at (${left}, ${top}) from ${info.width}px master →\n` +
    outputs
      .map(([f, b]) => `  ${f.replace(`${ROOT}/`, '')} ${(b.length / 1024).toFixed(1)} KB`)
      .join('\n'),
);
