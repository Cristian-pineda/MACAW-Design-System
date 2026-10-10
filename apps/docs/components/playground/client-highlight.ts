import { createHighlighter, type HighlighterGeneric } from 'shiki/bundle/web';

type WebHighlighter = HighlighterGeneric<string, string>;

let promise: Promise<WebHighlighter> | null = null;

/** The web bundle loads only the requested language and themes as lazy chunks; cached for the session. */
export function getClientHighlighter(): Promise<WebHighlighter> {
  promise ??= createHighlighter({
    themes: ['github-light', 'github-dark-default'],
    langs: ['tsx'],
  }) as Promise<WebHighlighter>;
  return promise;
}

export async function highlightTsx(code: string): Promise<string> {
  const highlighter = await getClientHighlighter();
  return highlighter.codeToHtml(code, {
    lang: 'tsx',
    themes: { light: 'github-light', dark: 'github-dark-default' },
    defaultColor: false,
  });
}
