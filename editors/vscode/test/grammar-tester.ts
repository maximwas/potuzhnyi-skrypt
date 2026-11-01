import { readFileSync } from 'node:fs';

import textmate from 'vscode-textmate';
import type { IGrammar, StateStack } from 'vscode-textmate';
import oniguruma from 'vscode-oniguruma';

const { INITIAL, Registry, parseRawGrammar } = textmate;
const { createOnigScanner, createOnigString, loadWASM } = oniguruma;

const SOURCE_GRAMMAR_PATHS: Readonly<Record<string, string>> = {
  'source.js': '../node_modules/tm-grammars/grammars/javascript.json',
  'source.potuzhno': '../syntaxes/potuzhno.tmLanguage.json',
  'potuzhno.keywords.injection': '../syntaxes/potuzhno-keywords.injection.json',
};

export class GrammarTester {
  private readonly grammar: IGrammar;

  private constructor(grammar: IGrammar) {
    this.grammar = grammar;
  }

  public static async create(): Promise<GrammarTester> {
    const wasmPath = new URL('../node_modules/vscode-oniguruma/release/onig.wasm', import.meta.url);
    const wasmBytes = readFileSync(wasmPath);

    await loadWASM(
      wasmBytes.buffer.slice(
        wasmBytes.byteOffset,
        wasmBytes.byteOffset + wasmBytes.byteLength,
      ) as ArrayBuffer,
    );

    const registry = new Registry({
      onigLib: Promise.resolve({ createOnigScanner, createOnigString }),
      loadGrammar: async (scopeName) => {
        const relativePath = SOURCE_GRAMMAR_PATHS[scopeName];

        if (relativePath === undefined) {
          return null;
        }

        const content = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

        return parseRawGrammar(content, relativePath);
      },
      getInjections: (scopeName) =>
        scopeName === 'source.potuzhno' ? ['potuzhno.keywords.injection'] : undefined,
    });
    const grammar = await registry.loadGrammar('source.potuzhno');

    if (grammar === null) {
      throw new Error('Не вдалося завантажити граматику source.potuzhno');
    }

    return new GrammarTester(grammar);
  }

  // Scope токена, що покриває перше входження needle у коді (код може бути багаторядковим).
  public scopesOf(code: string, needle: string): readonly string[] {
    const targetOffset = code.indexOf(needle);

    if (targetOffset < 0) {
      throw new Error(`«${needle}» немає в коді`);
    }

    let lineStart = 0;
    let ruleStack: StateStack = INITIAL;

    for (const line of code.split('\n')) {
      const lineEnd = lineStart + line.length;

      const { tokens, ruleStack: nextStack } = this.grammar.tokenizeLine(line, ruleStack);

      if (targetOffset < lineEnd) {
        const column = targetOffset - lineStart;
        const token = tokens.find(
          (candidate) => candidate.startIndex <= column && column < candidate.endIndex,
        );

        return token?.scopes ?? [];
      }

      ruleStack = nextStack;
      lineStart = lineEnd + 1;
    }

    return [];
  }
}
