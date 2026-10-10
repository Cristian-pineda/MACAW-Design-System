import { cva, type VariantProps } from 'class-variance-authority';
import { icons, type IconName } from './generated/names.ts';

export const iconVariants = cva('inline-block shrink-0', {
  variants: {
    size: { sm: 'size-3.5', md: 'size-4', lg: 'size-5', xl: 'size-6' },
    tone: {
      inherit: 'text-current',
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
      success: 'text-status-success',
      warning: 'text-status-warning',
      critical: 'text-status-critical',
      info: 'text-status-info',
      accent: 'text-status-accent',
    },
  },
  defaultVariants: { size: 'md', tone: 'inherit' },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  /** Icon name from the curated set. */
  name: IconName;
  /**
   * Accessible label. Omit when the icon is decorative or sits next to visible text;
   * provide it when the icon is the only content (for example an icon-only button's child).
   */
  label?: string;
  /** Stroke width in px. 1.5 for dense UI, 2 for emphasis. */
  strokeWidth?: 1.5 | 2;
}

/** A curated Lucide icon bound to MACAW size and tone tokens. Renders decorative by default. */
export function Icon({ name, size, tone, label, strokeWidth = 1.5 }: IconProps) {
  const Lucide = icons[name];
  const a11y = label
    ? { role: 'img', 'aria-label': label, 'aria-hidden': false }
    : { 'aria-hidden': true };
  return (
    <Lucide
      className={iconVariants({ size, tone })}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      {...a11y}
      data-icon={name}
    />
  );
}

export { iconNames, type IconName } from './generated/names.ts';
