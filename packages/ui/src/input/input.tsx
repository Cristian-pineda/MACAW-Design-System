import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';

export const inputVariants = cva(
  cn(
    'w-full min-w-0 rounded-control border border-field-line bg-field-bg font-sans text-fg-primary',
    'placeholder:text-fg-placeholder',
    'transition-colors duration-fast ease-standard',
    'hover:border-field-line-hover',
    'aria-invalid:border-field-line-invalid',
    'read-only:bg-surface-layer-2',
    'disabled:cursor-not-allowed disabled:border-field-line-disabled disabled:bg-field-bg-disabled disabled:text-fg-disabled',
    focusRing,
  ),
  {
    variants: {
      size: {
        sm: 'h-control-sm px-2.5 text-body-sm',
        md: 'h-control-md px-3 text-body-md',
        lg: 'h-control-lg px-3.5 text-body-lg',
      },
      align: { start: 'text-start', end: 'text-end tabular-nums' },
      hasStart: { true: 'pl-9', false: '' },
      hasEnd: { true: 'pr-9', false: '' },
    },
    defaultVariants: { size: 'md', align: 'start', hasStart: false, hasEnd: false },
  },
);

export type InputType = 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';

type NativeInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'className' | 'style' | 'color' | 'size' | 'type'
>;

interface InputBaseProps
  extends NativeInputProps, Omit<VariantProps<typeof inputVariants>, 'hasStart' | 'hasEnd'> {
  type?: InputType;
  /** Marks the value invalid: sets aria-invalid and the critical border. Pair with an error message via aria-describedby. */
  invalid?: boolean;
  /** Decorative content at the start, such as an Icon or a currency symbol. */
  startAdornment?: React.ReactNode;
  /** Decorative content at the end, such as a unit. */
  endAdornment?: React.ReactNode;
}

/** An Input must be labelled: by a visible label via `id` + `htmlFor`, or by aria-label / aria-labelledby. */
export type InputProps = InputBaseProps &
  ({ id: string } | { 'aria-label': string } | { 'aria-labelledby': string });

const ADORNMENT =
  'pointer-events-none absolute inset-y-0 flex items-center text-fg-muted text-body-sm';

/** Single-line text entry. Labelled by contract, with adornments for currency symbols and units. */
export function Input({
  size,
  align,
  invalid = false,
  startAdornment,
  endAdornment,
  type = 'text',
  ...rest
}: InputProps) {
  const hasStart = startAdornment !== undefined && startAdornment !== null;
  const hasEnd = endAdornment !== undefined && endAdornment !== null;
  const input = (
    <input
      type={type}
      className={cn(inputVariants({ size, align, hasStart, hasEnd }))}
      aria-invalid={invalid || undefined}
      data-invalid={invalid || undefined}
      {...rest}
    />
  );
  if (!hasStart && !hasEnd) return input;
  return (
    <span className="relative inline-flex w-full items-center">
      {hasStart && (
        <span aria-hidden="true" className={cn(ADORNMENT, 'left-3')}>
          {startAdornment}
        </span>
      )}
      {input}
      {hasEnd && (
        <span aria-hidden="true" className={cn(ADORNMENT, 'right-3')}>
          {endAdornment}
        </span>
      )}
    </span>
  );
}
