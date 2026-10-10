import type { TokenEntry } from '@/lib/tokens';

/** A colour swatch that resolves the token's CSS variable inside an explicit theme scope. */
export function Swatch({
  token,
  theme,
  size = 'md',
}: {
  token: TokenEntry;
  theme: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}) {
  const dimension = size === 'sm' ? 'size-5' : size === 'lg' ? 'h-12 w-full' : 'size-8';
  return (
    <span data-theme={theme} className="inline-flex rounded-sm bg-surface-canvas p-0.5">
      <span
        aria-hidden="true"
        className={`${dimension} inline-block rounded-xs border border-line-default`}
        style={{ backgroundColor: `var(${token.cssVar})` }}
      />
    </span>
  );
}
