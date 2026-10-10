'use client';

import { ToggleGroup } from 'radix-ui';
import { cn } from '@/lib/cn';
import { focusRing } from './focus';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  /** Accessible name for the group; or pass `labelledBy` with the id of a visible label. */
  label?: string;
  labelledBy?: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  size?: 'sm' | 'md';
}

/** Docs-local segmented control (DECISIONS.md #13): a single-select Radix ToggleGroup styled with token utilities. */
export function Segmented<T extends string>({
  label,
  labelledBy,
  options,
  value,
  onValueChange,
  size = 'sm',
}: SegmentedProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as T);
      }}
      className="inline-flex max-w-full flex-wrap gap-0.5 rounded-control border border-line-default bg-surface-layer-2 p-0.5"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'inline-flex items-center justify-center rounded-sm font-sans whitespace-nowrap text-fg-secondary transition-colors duration-fast ease-standard',
            size === 'sm' ? 'h-6 px-2 text-label-sm' : 'h-7 px-2.5 text-label-md',
            'hover:text-fg-primary data-[state=on]:bg-surface-layer-1 data-[state=on]:text-fg-primary data-[state=on]:shadow-xs',
            focusRing,
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
