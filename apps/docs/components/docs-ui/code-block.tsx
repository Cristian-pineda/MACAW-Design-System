import { highlight, type CodeLang } from '@/lib/highlight';
import { CopyButton } from './copy-button';
import { ScrollRegion } from '@/components/docs-ui/scroll-region';

export interface CodeBlockProps {
  code: string;
  /** Names the scrollable code region. */
  label?: string;
  lang?: CodeLang;
  /** Accessible name for the copy button; omit to hide it. */
  copyLabel?: string;
}

/** Server-rendered, shiki-highlighted code with an optional copy button. */
export async function CodeBlock({ code, lang = 'tsx', copyLabel, label = 'Code' }: CodeBlockProps) {
  const trimmed = code.replace(/\n$/, '');
  const html = await highlight(trimmed, lang);
  return (
    <div className="macaw-code relative rounded-container border border-line-default bg-surface-layer-1">
      {copyLabel && (
        <div className="absolute top-1 right-1">
          <CopyButton text={trimmed} label={copyLabel} />
        </div>
      )}
      <ScrollRegion label={label} html={html} />
    </div>
  );
}
