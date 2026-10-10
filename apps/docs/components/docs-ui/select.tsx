'use client';

import { Icon } from '@macaw-ds/icons';
import { Select as RadixSelect } from 'radix-ui';
import { cn } from '@/lib/cn';
import { focusRing } from './focus';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string> {
  /** id of the element that labels this select (a visible `<Text as="label">`). */
  labelledBy: string;
  id?: string;
  options: readonly SelectOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
}

/** Docs-local select (DECISIONS.md #13) on Radix Select, keyboard operable and labelled by a visible label. */
export function Select<T extends string>({
  labelledBy,
  id,
  options,
  value,
  onValueChange,
}: SelectProps<T>) {
  return (
    <RadixSelect.Root value={value} onValueChange={(next) => onValueChange(next as T)}>
      <RadixSelect.Trigger
        id={id}
        aria-labelledby={labelledBy}
        className={cn(
          'inline-flex h-control-sm w-full items-center justify-between gap-2 rounded-control border border-field-line bg-field-bg px-2.5 font-sans text-body-sm text-fg-primary',
          'transition-colors duration-fast ease-standard hover:border-field-line-hover',
          focusRing,
        )}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <Icon name="chevron-down" size="sm" tone="muted" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-dropdown max-h-80 min-w-40 overflow-hidden rounded-container border border-line-default bg-surface-overlay shadow-floating"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="relative flex h-7 cursor-default items-center gap-2 rounded-sm pr-2 pl-7 font-sans text-body-sm text-fg-primary outline-none select-none data-[disabled]:text-fg-disabled data-[highlighted]:bg-action-ghost-hover"
              >
                <span className="absolute left-2 inline-flex items-center">
                  <RadixSelect.ItemIndicator>
                    <Icon name="check" size="sm" tone="accent" />
                  </RadixSelect.ItemIndicator>
                </span>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
