# ПотужнийСкрипт для VS Code

Підсвітка синтаксису файлів `*.potuzhno`: звичайний JavaScript (граматика VS Code) плюс мемні слова,
які підсвічуються як ключові слова, типи, константи, класи й методи залежно від того, що вони замінюють.

## Встановлення

```sh
npm install
npm run package
code --install-extension potuzhno-syntax-0.1.0.vsix
```

## Оновлення словника

Мемні слова беруться з `src/dictionary/meme-entries.ts`. Після зміни словника:

```sh
npm run generate   # перегенерує syntaxes/potuzhno-keywords.injection.json
npm test           # перевіряє граматику й що згенерований файл свіжий
```

Обмеження: мемне слово у вкладеному шаблонному рядку всередині `${}` може підсвітитися.
