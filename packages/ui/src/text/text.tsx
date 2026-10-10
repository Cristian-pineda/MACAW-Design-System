import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn.ts';

export const textVariants = cva('m-0', {
  variants: {
    variant: {
      'display-lg': 'font-sans text-display-lg',
      'display-md': 'font-sans text-display-md',
      'heading-lg': 'font-sans text-heading-lg',
      'heading-md': 'font-sans text-heading-md',
      'heading-sm': 'font-sans text-heading-sm',
      'body-lg': 'font-sans text-body-lg',
      'body-md': 'font-sans text-body-md',
      'body-sm': 'font-sans text-body-sm',
      'label-md': 'font-sans text-label-md',
      'label-sm': 'font-sans text-label-sm',
      caption: 'font-sans text-caption',
      'numeric-lg': 'font-sans text-numeric-lg tabular-nums',
      'numeric-md': 'font-sans text-numeric-md tabular-nums',
      'numeric-sm': 'font-sans text-numeric-sm tabular-nums',
      code: 'font-mono text-code',
    },
    tone: {
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      muted: 'text-fg-muted',
      inverse: 'text-fg-inverse',
      numeric: 'text-fg-numeric',
      success: 'text-status-success-fg',
      warning: 'text-status-warning-fg',
      critical: 'text-status-critical-fg',
      info: 'text-status-info-fg',
      accent: 'text-status-accent-fg',
    },
    align: { start: 'text-start', center: 'text-center', end: 'text-end' },
    numeric: { true: 'tabular-nums', false: '' },
    truncate: { true: 'truncate', false: '' },
  },
  defaultVariants: {
    variant: 'body-md',
    tone: 'primary',
    align: 'start',
    numeric: false,
    truncate: false,
  },
});

export type TextElement =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'dt'
  | 'dd'
  | 'legend'
  | 'strong'
  | 'em'
  | 'time';

type NativeTextProps = Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style' | 'color'> & {
  /** For `as="label"`: the id of the control this label names. */
  htmlFor?: string;
  /** For `as="time"`: the machine-readable value. */
  dateTime?: string;
};

export interface TextProps
  extends NativeTextProps, Omit<VariantProps<typeof textVariants>, 'numeric' | 'truncate'> {
  /** Rendered element. Pick for semantics (h2 for a section title, label for a field), not for looks. */
  as?: TextElement;
  /** Tabular numerals and the 7:1 numeric colour. Use for every money, count and date column. */
  numeric?: boolean;
  /** Single line with an ellipsis. The full text must be available elsewhere (title or tooltip). */
  truncate?: boolean;
  children?: React.ReactNode;
}

/** Typography primitive. Every piece of text in a MACAW screen goes through Text so variants and tones stay consistent. */
export function Text({
  as = 'p',
  variant,
  tone,
  align,
  numeric = false,
  truncate = false,
  children,
  ...rest
}: TextProps) {
  const resolvedTone = tone ?? (numeric ? 'numeric' : 'primary');
  return React.createElement(
    as,
    {
      className: cn(textVariants({ variant, tone: resolvedTone, align, numeric, truncate })),
      ...rest,
    },
    children,
  );
}
