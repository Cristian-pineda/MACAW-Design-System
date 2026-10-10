import { cx } from 'class-variance-authority';

type ClassValue = Parameters<typeof cx>[number];

/**
 * Joins class names. This is cva's `cx`, not tailwind-merge: MACAW components never accept
 * external classes, so nothing needs merging (DECISIONS.md #9).
 */
export function cn(...inputs: ClassValue[]): string {
  return cx(...inputs);
}
