'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';
import { cn } from '../lib/cn.ts';
import { focusRing } from '../lib/focus.ts';
import type { NativeProps } from '../lib/types.ts';
import { Text, type TextProps } from '../text/text.tsx';

type Padding = 'none' | 'sm' | 'md';
const PaddingContext = React.createContext<Padding>('md');

export const cardVariants = cva(
  'overflow-hidden rounded-container border border-line-default bg-surface-default text-fg-primary',
  {
    variants: {
      elevation: { flat: 'shadow-flat', raised: 'shadow-raised' },
      padding: { none: '', sm: '', md: '' },
      interactive: {
        true: cn(
          'block w-full cursor-pointer text-start transition-colors duration-fast ease-standard hover:border-line-strong',
          focusRing,
        ),
        false: '',
      },
    },
    defaultVariants: { elevation: 'flat', padding: 'md', interactive: false },
  },
);

const PAD_X: Record<Padding, string> = { none: '', sm: 'px-4', md: 'px-5' };
const PAD_Y: Record<Padding, string> = { none: '', sm: 'py-3', md: 'py-4' };

export interface CardProps
  extends NativeProps<'div'>, Omit<VariantProps<typeof cardVariants>, 'interactive' | 'padding'> {
  /** Inner padding applied by Card.Header, Card.Body and Card.Footer. */
  padding?: Padding;
  /** Hover and focus affordances for a card that is a link or a button. Use with asChild. */
  interactive?: boolean;
  /** Render the child (an anchor or button) as the card itself. */
  asChild?: boolean;
  children?: React.ReactNode;
}

function CardRoot({
  elevation,
  padding = 'md',
  interactive = false,
  asChild,
  children,
  ...rest
}: CardProps) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <PaddingContext.Provider value={padding}>
      <Comp className={cn(cardVariants({ elevation, padding, interactive }))} {...rest}>
        {children}
      </Comp>
    </PaddingContext.Provider>
  );
}

function usePadding(): Padding {
  return React.useContext(PaddingContext);
}

function CardHeader({ children, ...rest }: NativeProps<'div'> & { children?: React.ReactNode }) {
  const p = usePadding();
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4',
        PAD_X[p],
        p === 'none' ? '' : 'pt-4 pb-3',
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardTitle({ as = 'h3', variant = 'heading-sm', ...rest }: TextProps) {
  return <Text as={as} variant={variant} {...rest} />;
}

function CardDescription({ variant = 'body-sm', tone = 'muted', ...rest }: TextProps) {
  return <Text variant={variant} tone={tone} {...rest} />;
}

function CardBody({ children, ...rest }: NativeProps<'div'> & { children?: React.ReactNode }) {
  const p = usePadding();
  return (
    <div className={cn(PAD_X[p], PAD_Y[p])} {...rest}>
      {children}
    </div>
  );
}

function CardFooter({ children, ...rest }: NativeProps<'div'> & { children?: React.ReactNode }) {
  const p = usePadding();
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-line-subtle bg-surface-sunken',
        PAD_X[p],
        p === 'none' ? '' : 'py-3',
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * A bordered surface that groups related content: a KPI, a form section, a record summary.
 * Parts are available both as `Card.Header` and as named exports (`CardHeader`), because a server
 * component cannot reach into a client module's properties (`Card.Header` is undefined there).
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

export { CardBody, CardDescription, CardFooter, CardHeader, CardTitle };
