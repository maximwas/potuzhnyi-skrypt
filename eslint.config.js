import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    'node_modules/',
    'graphify-out/',
    'editors/vscode/node_modules/',
    'editors/vscode/syntaxes/',
    'editors/vscode/dist/',
    'site/',
    'dist/',
  ]),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // Хост розширень VS Code завантажує main через require
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable' },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      'id-length': ['error', { min: 2 }],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      // Порожній рядок між логічними блоками: після імпортів, декларацій і блоків, перед return/throw
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: ['return', 'throw', 'break', 'continue'] },
        { blankLine: 'always', prev: '*', next: ['block-like', 'multiline-expression'] },
        { blankLine: 'always', prev: ['block-like', 'multiline-expression'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['export', 'class', 'function'] },
        { blankLine: 'always', prev: ['export', 'class', 'function'], next: '*' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
    },
  },
]);
