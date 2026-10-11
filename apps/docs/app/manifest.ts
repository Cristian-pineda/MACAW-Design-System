import type { MetadataRoute } from 'next';
import { tokenHex } from '@/lib/brand-colors';
import { SITE_NAME } from '@/lib/site';

/** Web app manifest: the MACAW mark for installs and launchers (maskable variant has a safe zone). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} Design System`,
    short_name: SITE_NAME,
    description: 'An agentic design system for financial software.',
    start_url: '/',
    display: 'standalone',
    background_color: tokenHex('color.surface.layer-1'),
    theme_color: tokenHex('color.surface.layer-1'),
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/brand/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
