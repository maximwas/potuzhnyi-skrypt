import { createHighlighterCore, type LanguageRegistration } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import javascript from '@shikijs/langs/javascript';

import injectionGrammar from '@extension/syntaxes/potuzhno-keywords.injection.json';
import potuzhnoGrammar from '@extension/syntaxes/potuzhno.tmLanguage.json';

import { PLAYGROUND_THEME, PLAYGROUND_THEME_NAME } from '../data/playground-theme.ts';

export interface PlaygroundHighlighter {
  highlightPotuzhno(code: string): string;
  highlightJavaScript(code: string): string;
}

// Граматику беремо з розширення VS Code: підсвітка на сайті й у редакторі не розходиться.
// Цей модуль вантажиться динамічно після першого малюнка (~80 КБ gzip).
export async function createPlaygroundHighlighter(): Promise<PlaygroundHighlighter> {
  const highlighter = await createHighlighterCore({
    themes: [PLAYGROUND_THEME],
    langs: [
      javascript,
      { ...potuzhnoGrammar, name: 'potuzhno', embeddedLangs: ['javascript'] },
      { ...injectionGrammar, name: 'potuzhno-injection', injectTo: ['source.potuzhno'] },
    ] as unknown as LanguageRegistration[],
    engine: createJavaScriptRegexEngine(),
  });
  // tabindex на <pre> зробив би фокусним навіть шар під textarea; фокус задаємо самі на обгортці.
  const transformers = [
    {
      pre(node: { properties: Record<string, unknown> }) {
        delete node.properties.tabindex;
      },
    },
  ];
  const highlight = (code: string, lang: string) =>
    highlighter.codeToHtml(code, { lang, theme: PLAYGROUND_THEME_NAME, transformers });

  return {
    highlightPotuzhno: (code) => highlight(code, 'potuzhno'),
    highlightJavaScript: (code) => highlight(code, 'javascript'),
  };
}
