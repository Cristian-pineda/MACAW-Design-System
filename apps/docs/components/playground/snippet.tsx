'use client';

import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/docs-ui/copy-button';
import { highlightTsx } from './client-highlight';

/** Highlights the generated JSX on the client; shows plain text until shiki is ready. */
export function Snippet({ code }: { code: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlightTsx(code)
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="macaw-code relative rounded-container border border-line-default bg-surface-default">
      <div className="absolute top-1 right-1">
        <CopyButton text={code} label="Copy snippet" />
      </div>
      {html ? (
        <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="m-0 overflow-x-auto p-4 font-mono text-code text-fg-primary">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
