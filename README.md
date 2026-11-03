# ПотужнийСкрипт

Мемна мова програмування: звичайний JavaScript, але файли мають розширення `.potuzhno`,
а ключові слова й методи названі на честь мемів про українську політику.

```js
потужно бюджет = [100, 200, 300];
ОП.звернення(бюджет.розпил(сума => сума * 0.1).коса(", "));
```

## Запуск

Потрібен Node 26.2 або новіший. Збірки немає: Node сам стирає типи й запускає `.ts`.

```sh
npm install
node bin/potuzhno.ts examples/бюджет.potuzhno
```

## Перевірка

```sh
npm run check   # tsc, ESLint, Prettier і тести
npm run format  # привести код до єдиного стилю
```

## Як це влаштовано

Класи отримують залежності через конструктор, а збирає їх `src/container.ts` ([Awilix](https://github.com/jeffijoe/awilix)).

```
CommandLine → ScriptRunner → ModuleLoader → Translator → IdentifierScanner
                                                       → MemeDictionary
                                                       → LatinTransliterator
```

| Папка | Що там |
|---|---|
| `src/dictionary/` | словник мемів: дані й клас `MemeDictionary` |
| `src/translation/` | пошук імен у коді та заміна слів: `IdentifierScanner`, `Translator` |
| `src/transliteration/` | власні імена латиницею за КМУ-2010: `LatinTransliterator` |
| `src/runtime/` | підключення до Node: `ModuleLoader`, `ScriptRunner` |
| `src/cli/` | `CommandLine` |
| `editors/vscode/` | розширення VS Code з підсвіткою `.potuzhno` |

Власні імена в `.potuzhno` (змінні, функції, класи) перекладач переписує латиницею: `Депутат` → `Deputat`, `імʼя` → `imia`.
У словнику апостроф пишемо як `ʼ` (U+02BC): звичайний `'` у JS відкриває рядок.

## Підсвітка у VS Code

```sh
cd editors/vscode
npm install
npm run package
code --install-extension potuzhno-syntax-0.1.0.vsix
```

## Обмеження

Пакет не можна опублікувати в npm як є: Node не стирає типи у файлах з `node_modules`, тому перед публікацією потрібна збірка `tsc`.
