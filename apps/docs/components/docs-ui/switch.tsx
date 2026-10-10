'use client';

import { Switch as RadixSwitch } from 'radix-ui';
import { cn } from '@/lib/cn';
import { focusRing } from './focus';

export interface SwitchProps {
  /** Pair with a visible `<Text as="label" htmlFor={id}>`. */
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Docs-local switch (DECISIONS.md #13) on Radix Switch; the label comes from a visible `<Text as="label">`. */
export function Switch({ id, checked, onCheckedChange, disabled }: SwitchProps) {
  return (
    <RadixSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-pill border border-transparent bg-line-strong',
        'transition-colors duration-fast ease-standard disabled:cursor-not-allowed disabled:bg-action-disabled data-[state=checked]:bg-action-primary',
        focusRing,
      )}
    >
      <RadixSwitch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-surface-layer-1 shadow-xs transition-transform duration-fast ease-standard data-[state=checked]:translate-x-4" />
    </RadixSwitch.Root>
  );
}
