import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { Slot } from 'radix-ui';
import type * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';
import type { NativeProps } from '../lib/types.ts';

export const buttonVariants = cva(
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-control border whitespace-nowrap select-none',
    'transition-colors duration-fast ease-standard',
    'disabled:cursor-not-allowed aria-busy:cursor-progress',
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-action-primary text-action-primary-fg hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-disabled disabled:text-action-disabled-fg',
        secondary:
          'border-action-secondary-line bg-action-secondary text-action-secondary-fg shadow-xs hover:bg-action-secondary-hover active:bg-action-secondary-active disabled:border-transparent disabled:bg-action-disabled disabled:text-action-disabled-fg disabled:shadow-flat',
        ghost:
          'border-transparent bg-transparent text-fg-primary hover:bg-action-ghost-hover active:bg-action-ghost-active disabled:bg-transparent disabled:text-action-disabled-fg',
        destructive:
          'border-transparent bg-action-destructive text-action-destructive-fg hover:bg-action-destructive-hover active:bg-action-destructive-active disabled:bg-action-disabled disabled:text-action-disabled-fg',
      },
      size: {
        sm: 'h-control-sm gap-1.5 px-2.5 text-label-sm',
        md: 'h-control-md gap-2 px-3 text-label-md',
        lg: 'h-control-lg gap-2 px-4 text-label-md',
      },
      iconOnly: { true: 'px-0', false: '' },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm', class: 'w-7' },
      { iconOnly: true, size: 'md', class: 'w-8' },
      { iconOnly: true, size: 'lg', class: 'w-10' },
    ],
    defaultVariants: { variant: 'primary', size: 'md', iconOnly: false },
  },
);

interface ButtonBaseProps
  extends NativeProps<'button'>, Omit<VariantProps<typeof buttonVariants>, 'iconOnly'> {
  /** Shows a spinner, announces busy, and blocks clicks. The label stays visible. */
  loading?: boolean;
  /** Decorative icon before the label. Pass `<Icon name="…" />`. */
  iconStart?: React.ReactNode;
  /** Decorative icon after the label. */
  iconEnd?: React.ReactNode;
  /** Render the child element instead of a button (for links). The child receives the button's props and classes. */
  asChild?: boolean;
  children: React.ReactNode;
}

type TextButtonProps = ButtonBaseProps & { iconOnly?: false };
/** An icon-only button has no visible text, so the accessible name is required at the type level. */
type IconOnlyButtonProps = ButtonBaseProps & { iconOnly: true; 'aria-label': string };

export type ButtonProps = TextButtonProps | IconOnlyButtonProps;

/** Triggers an action. Not navigation: for links, use `asChild` with an anchor, or a Link component. */
export function Button({
  asChild,
  loading = false,
  iconStart,
  iconEnd,
  iconOnly = false,
  variant,
  size,
  type,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  const isDisabled = disabled || loading;
  // The spinner imports one Lucide icon directly so Button does not carry the whole curated set.
  const spinner = (
    <LoaderCircle
      aria-hidden="true"
      data-icon="loader"
      className={cn(
        'shrink-0 animate-spin motion-reduce:animate-none',
        size === 'sm' ? 'size-3.5' : 'size-4',
      )}
      strokeWidth={1.5}
      absoluteStrokeWidth
    />
  );
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, iconOnly }))}
      type={asChild ? undefined : (type ?? 'button')}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...rest}
    >
      {loading ? spinner : iconStart}
      <Slot.Slottable>{children}</Slot.Slottable>
      {!loading && iconEnd}
    </Comp>
  );
}
