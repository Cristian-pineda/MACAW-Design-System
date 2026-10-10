import { highlight, type CodeLang } from '@/lib/highlight';
import { CopyButton } from './copy-button';

export interface CodeBlockProps {
  code: string;
  lang?: CodeLang;
  /** Accessible name for the copy button; omit to hide it. */
  copyLabel?: string;
}

/** Server-rendered, shiki-highlighted code with an optional copy button. */
export async function CodeBlock({ code, lang = 'tsx', copyLabel }: CodeBlockProps) {
  const trimmed = code.replace(/\n$/, '');
  const html = await highlight(trimmed, lang);
  return (
    <div className="macaw-code relative rounded-container border border-line-default bg-surface-default">
      {copyLabel && (
        <div className="absolute top-1 right-1">
          <CopyButton text={trimmed} label={copyLabel} />
        </div>
      )}
      <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
