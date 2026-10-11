import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { tokenHex } from '@/lib/brand-colors';
import { SITE_NAME } from '@/lib/site';

// Link previews (Slack, LinkedIn, X, iMessage): the mark beside the name and tagline.
export const alt = 'MACAW, an agentic design system for financial software';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const mark = await readFile(path.join(process.cwd(), 'public/brand/macaw-mark-512.png'));
  const src = `data:image/png;base64,${mark.toString('base64')}`;
  // ImageResponse cannot read CSS variables, so the colours are resolved from the token values.
  const frame = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 64,
    paddingLeft: 96,
    paddingRight: 96,
    background: `linear-gradient(135deg, ${tokenHex('color.neutral.0')} 0%, ${tokenHex('color.neutral.100')} 100%)`,
  } as const;
  const title = {
    fontSize: 112,
    fontWeight: 700,
    letterSpacing: -4,
    color: tokenHex('color.neutral.950'),
  };
  const tagline = {
    fontSize: 40,
    lineHeight: 1.25,
    color: tokenHex('color.neutral.700'),
    maxWidth: 620,
  };
  return new ImageResponse(
    <div style={frame}>
      <img src={src} width={360} height={360} alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={title}>{SITE_NAME}</div>
        <div style={tagline}>An agentic design system for financial software.</div>
      </div>
    </div>,
    size,
  );
}
