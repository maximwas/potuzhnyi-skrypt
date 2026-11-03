// Підказки мемних слів і наведення на власні імена. CommonJS, бо пакет має "type": "module", а хост
// розширень завантажує main через require.
const path = require('node:path');

function createCompletionItems(vscode, completions) {
  return completions.map(({ label, detail, kind }) => {
    const item = new vscode.CompletionItem(
      { label, description: detail },
      vscode.CompletionItemKind[kind],
    );

    item.detail = detail;

    return item;
  });
}

// shortcut: TypeScript беремо із самого VS Code, а не вшиваємо у vsix (~24 МБ); якщо шлях зміниться,
// лишаться тільки підказки мемних слів. Посилити: вшити typescript у vsix.
function loadTypeScript(vscode) {
  try {
    return require(
      path.join(
        vscode.env.appRoot,
        'extensions',
        'node_modules',
        'typescript',
        'lib',
        'typescript.js',
      ),
    );
  } catch {
    return undefined;
  }
}

function createHoverProvider(vscode, hoverInfoService) {
  return {
    provideHover(document, position) {
      const info = hoverInfoService.hoverAt(document.getText(), document.offsetAt(position));

      if (info === undefined) {
        return undefined;
      }

      return new vscode.Hover(
        new vscode.MarkdownString(info.markdown),
        new vscode.Range(document.positionAt(info.start), document.positionAt(info.end)),
      );
    },
  };
}

function activate(context) {
  const vscode = require('vscode');
  const items = createCompletionItems(vscode, require('./completions.json'));
  const provider = vscode.languages.registerCompletionItemProvider('potuzhno', {
    provideCompletionItems: () => items,
  });

  context.subscriptions.push(provider);

  const { createHoverInfoService } = require('./dist/hover-info-service.cjs');
  const hoverInfoService = createHoverInfoService(loadTypeScript(vscode));

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      'potuzhno',
      createHoverProvider(vscode, hoverInfoService),
    ),
  );
}

module.exports = { activate, createCompletionItems, createHoverProvider };
