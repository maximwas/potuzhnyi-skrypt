// Підказки мемних слів. CommonJS, бо пакет має "type": "module", а хост розширень завантажує main через require.
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

function activate(context) {
  const vscode = require('vscode');
  const items = createCompletionItems(vscode, require('./completions.json'));
  const provider = vscode.languages.registerCompletionItemProvider('potuzhno', {
    provideCompletionItems: () => items,
  });

  context.subscriptions.push(provider);
}

module.exports = { activate, createCompletionItems };
