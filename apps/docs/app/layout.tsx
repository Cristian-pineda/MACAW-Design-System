import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { DENSITY_INIT_SCRIPT } from '@/components/shell/density';
import { ThemeProvider } from '@/components/shell/theme-provider';
import { REGISTRY_BASE_URL, SITE_NAME } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const DESCRIPTION =
  'An agentic design system for financial software: tokens, React components and the agent layer that lets Claude build correct screens.';

// Icons come from the file conventions in this folder (favicon.ico, icon.png, apple-icon.png),
// generated from brand/macaw-logo.png by `pnpm brand:build`.
export const metadata: Metadata = {
  metadataBase: new URL(REGISTRY_BASE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: `${SITE_NAME} Design System`,
  appleWebApp: { title: SITE_NAME },
  openGraph: {
    type: 'website',
    siteName: `${SITE_NAME} Design System`,
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: DESCRIPTION },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <head>
        {/* Applies the stored density before paint; see components/shell/density.ts. */}
        <script dangerouslySetInnerHTML={{ __html: DENSITY_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
