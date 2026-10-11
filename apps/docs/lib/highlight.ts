import { createHighlighter, type Highlighter } from 'shiki';

export type CodeLang = 'tsx' | 'ts' | 'bash' | 'css' | 'json' | 'md' | 'text';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ['github-light', 'github-dark-default'],
    langs: ['tsx', 'ts', 'bash', 'css', 'json', 'md'],
  });
  return highlighterPromise;
}

/** Server-side highlighting with both themes; the dark colours are switched on by `[data-theme="dark"]` in globals.css. */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: lang === 'text' ? 'txt' : lang,
    themes: { light: 'github-light', dark: 'github-dark-default' },
    defaultColor: false,
    // github-light's orange (props and parameters, 3.5:1 on white) fails AA; darken it to 5.5:1.
    colorReplacements: { 'github-light': { '#e36209': '#b04a00' } },
  });
}
