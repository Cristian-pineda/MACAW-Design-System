'use client';

import { Icon } from '@macaw-ds/icons';
import { Button } from '@macaw-ds/ui';
import { useEffect, useRef, useState } from 'react';

export interface CopyButtonProps {
  /** The text written to the clipboard. */
  text: string;
  /** Accessible name, e.g. "Copy install command". */
  label: string;
  size?: 'sm' | 'md';
}

/** Copies text to the clipboard and confirms with a check icon for a moment. */
export function CopyButton({ text, label, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Button
        iconOnly
        variant="ghost"
        size={size}
        aria-label={copied ? 'Copied' : label}
        onClick={copy}
      >
        <Icon name={copied ? 'check' : 'copy'} tone={copied ? 'success' : 'inherit'} />
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </>
  );
}
