import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/shell/theme-provider';
import { SITE_NAME } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description:
    'An agentic design system for financial software: tokens, React components and the agent layer that lets Claude build correct screens.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
