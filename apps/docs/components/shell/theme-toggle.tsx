'use client';

import { Icon } from '@macaw-ds/icons';
import { Button } from '@macaw-ds/ui';
import { useTheme } from 'next-themes';
import { useMounted } from '@/lib/use-mounted';

/** Switches between light and dark. Reads the resolved theme only after hydration so server and client markup match. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === 'dark';
  return (
    <Button
      iconOnly
      variant="ghost"
      size="md"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </Button>
  );
}
