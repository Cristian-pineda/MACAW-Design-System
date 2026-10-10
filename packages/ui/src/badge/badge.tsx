import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import type { NativeProps } from '../lib/types.ts';

const TONES = ['neutral', 'success', 'warning', 'critical', 'info', 'accent'] as const;
export type BadgeTone = (typeof TONES)[number];

export const badgeVariants = cva(
  'inline-flex shrink-0 items-center rounded-pill border font-sans whitespace-nowrap',
  {
    variants: {
      tone: Object.fromEntries(TONES.map((t) => [t, ''])) as Record<BadgeTone, string>,
      variant: {
        soft: 'border-transparent',
        solid: 'border-transparent',
        outline: 'bg-transparent',
      },
      size: { sm: 'h-5 gap-1 px-1.5 text-caption', md: 'h-6 gap-1.5 px-2 text-label-sm' },
    },
    compoundVariants: [
      { tone: 'neutral', variant: 'soft', class: 'bg-status-neutral-bg text-status-neutral-fg' },
      { tone: 'success', variant: 'soft', class: 'bg-status-success-bg text-status-success-fg' },
      { tone: 'warning', variant: 'soft', class: 'bg-status-warning-bg text-status-warning-fg' },
      { tone: 'critical', variant: 'soft', class: 'bg-status-critical-bg text-status-critical-fg' },
      { tone: 'info', variant: 'soft', class: 'bg-status-info-bg text-status-info-fg' },
      { tone: 'accent', variant: 'soft', class: 'bg-status-accent-bg text-status-accent-fg' },
      {
        tone: 'neutral',
        variant: 'solid',
        class: 'bg-status-neutral-solid text-status-neutral-solid-fg',
      },
      {
        tone: 'success',
        variant: 'solid',
        class: 'bg-status-success-solid text-status-success-solid-fg',
      },
      {
        tone: 'warning',
        variant: 'solid',
        class: 'bg-status-warning-solid text-status-warning-solid-fg',
      },
      {
        tone: 'critical',
        variant: 'solid',
        class: 'bg-status-critical-solid text-status-critical-solid-fg',
      },
      { tone: 'info', variant: 'solid', class: 'bg-status-info-solid text-status-info-solid-fg' },
      {
        tone: 'accent',
        variant: 'solid',
        class: 'bg-status-accent-solid text-status-accent-solid-fg',
      },
      {
        tone: 'neutral',
        variant: 'outline',
        class: 'border-status-neutral-line text-status-neutral-fg',
      },
      {
        tone: 'success',
        variant: 'outline',
        class: 'border-status-success-line text-status-success-fg',
      },
      {
        tone: 'warning',
        variant: 'outline',
        class: 'border-status-warning-line text-status-warning-fg',
      },
      {
        tone: 'critical',
        variant: 'outline',
        class: 'border-status-critical-line text-status-critical-fg',
      },
      { tone: 'info', variant: 'outline', class: 'border-status-info-line text-status-info-fg' },
      {
        tone: 'accent',
        variant: 'outline',
        class: 'border-status-accent-line text-status-accent-fg',
      },
    ],
    defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
  },
);

const DOT: Record<BadgeTone, string> = {
  neutral: 'bg-status-neutral',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  critical: 'bg-status-critical',
  info: 'bg-status-info',
  accent: 'bg-status-accent',
};

export interface BadgeProps extends NativeProps<'span'>, VariantProps<typeof badgeVariants> {
  /** A small leading dot in the tone colour. Use for live or state indicators ("Active"). */
  dot?: boolean;
  children: React.ReactNode;
}

/** A short status label: Paid, Overdue, Draft. Text carries the meaning; colour reinforces it. */
export function Badge({
  tone = 'neutral',
  variant,
  size,
  dot = false,
  children,
  ...rest
}: BadgeProps) {
  const resolvedTone: BadgeTone = tone ?? 'neutral';
  return (
    <span className={cn(badgeVariants({ tone: resolvedTone, variant, size }))} {...rest}>
      {dot && (
        <span
          aria-hidden="true"
          className={cn('size-1.5 shrink-0 rounded-full', DOT[resolvedTone])}
        />
      )}
      {children}
    </span>
  );
}
