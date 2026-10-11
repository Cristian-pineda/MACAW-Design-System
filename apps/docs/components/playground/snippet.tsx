'use client';

import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/docs-ui/copy-button';
import { highlightTsx } from './client-highlight';
import { ScrollRegion } from '@/components/docs-ui/scroll-region';

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
    <div className="macaw-code relative rounded-container border border-line-default bg-surface-layer-1">
      <div className="absolute top-1 right-1">
        <CopyButton text={code} label="Copy snippet" />
      </div>
      {html ? (
        <ScrollRegion label="Generated code" html={html} />
      ) : (
        <ScrollRegion label="Generated code">
          <pre className="m-0 p-4 font-mono text-code text-fg-primary">
            <code>{code}</code>
          </pre>
        </ScrollRegion>
      )}
    </div>
  );
}
