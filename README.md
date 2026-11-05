# ПотужнийСкрипт

Мемна мова програмування: звичайний JavaScript, але файли мають розширення `.potuzhno`,
а ключові слова й методи названі на честь мемів про українську політику.

![Сцена з сайту ПотужногоСкрипта: герої й слова-репліки, кожне слово — ключове слово мови](https://raw.githubusercontent.com/maximwas/potuzhnyi-skrypt/main/assets/scene.webp)

```js
потужно бюджет = [100, 200, 300];
ОП.звернення(бюджет.розпил(сума => сума * 0.1).коса(", "));
```

## Запуск

Потрібен Node 26.2 або новіший.

```sh
npm install -g potuzhnyi-script
potuzhno файл.potuzhno
```

З репозиторію (збірки немає: Node сам стирає типи й запускає `.ts`):

```sh
npm install
node bin/potuzhno.ts examples/бюджет.potuzhno
```

## Збірка: `potuzhno build`

Щоб віддати програму без `potuzhno`, її збирають у звичайний JavaScript. Налаштування лежать у файлі
`потужнийконфіг.json` у корені проєкту, як `tsconfig.json` у TypeScript.

```sh
potuzhno build                    # збірка за потужнийконфіг.json у поточній теці
potuzhno build -w                 # те саме, але перезбирає після кожної зміни
potuzhno build -p examples/магазин # конфіг в іншій теці або файл: -p шлях/до/файлу.json
```

Два режими:

```jsonc
// 1. Зберегти структуру: кожен .potuzhno стає окремим .mjs, теки повторюються в outDir
{
  "include": ["src"],
  "outDir": "dist"
}
```

```jsonc
// 2. Усе в один файл: esbuild іде від entry за імпортами
{
  "bundle": true,
  "entry": "src/головна.potuzhno",
  "outDir": "dist"
}
```

| Параметр | Що робить | Типово |
|---|---|---|
| `include` | файли, теки (усі `.potuzhno` всередині) або шаблони (`src/**/*.potuzhno`) | `["."]` |
| `rootDir` | від якої теки рахувати структуру в `outDir` | спільна тека всіх файлів |
| `outDir` | куди класти зібране | `"dist"` |
| `bundle` | `true` — усе в один файл | `false` |
| `entry` | з чого починається програма (лише з `bundle: true`) | немає |
| `outFile` | назва зібраного файлу (лише з `bundle: true`) | назва `entry` і `.mjs` |
| `sourceMap` | писати карти джерел, щоб помилки вказували на рядки `.potuzhno` | `true` |

Шляхи в конфігу рахуються від теки, де він лежить. `node_modules` і `outDir` збірка пропускає.
Зібрані файли мають розширення `.mjs`: Node завжди читає їх як ES-модулі, що б не стояло в `"type"` у `package.json`. У режимі структури шляхи імпорту `./файл.potuzhno` стають `./файл.mjs`; у режимі
одного файлу пакети з `node_modules` лишаються імпортами. Невідомий параметр у конфігу — помилка,
щоб одруківка не мовчала.

Готові конфіги лежать у `examples/магазин`: `потужнийконфіг.json` (структура) і `в-один-файл.json`.

## Приклади

У `examples/` лежать програми, які можна запускати й підглядати в них слова мови:

| Файл | Що показує |
|---|---|
| `привіт.potuzhno` | змінні, функція, цикл, шаблонний рядок |
| `числа.potuzhno` | FizzBuzz, прості числа, рекурсія |
| `колекції.potuzhno` | `Сімʼя` (Map), `Фракція` (Set), групування, деструктуризація, генератор |
| `асинхронність.potuzhno` | `Обіцянка`, `завтрашній` і `два_три_тижні`, таймер, `пронесе`/`набу` |
| `бюджет.potuzhno` | класи, успадкування, винятки |
| `магазин/` | кілька файлів, що імпортують один одного |

```sh
node bin/potuzhno.ts examples/магазин/головна.potuzhno
```

### Модулі

Файли звʼязуються звичайним ES-синтаксисом, лише слова інші. Шлях до сусіднього файлу пишуть із розширенням `.potuzhno`.

```js
вивезти батон ПДВ = 0.2;                        // export const
вивезти тво партія Кошик {}                     // export default class
вивезти { тво як Кошик } з "./кошик.potuzhno";   // реекспорт

завезти Кошик з "./кошик.potuzhno";             // import за замовчуванням
завезти { ПДВ, гривні як формат } з "./гроші.potuzhno"; // іменовані й псевдонім
завезти * як вітрина з "./індекс.potuzhno";     // увесь модуль
батон гроші = два_три_тижні завезти("./гроші.potuzhno"); // динамічний import
```

Власні імена не мають збігатися зі словами словника: `кандидат` — це `case`, тож параметр із таким іменем зламає функцію.

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
| `src/build/` | `potuzhno build`: конфіг, пошук файлів, збірка, стеження |
| `src/cli/` | `CommandLine`, `BuildCommand` |
| `editors/vscode/` | розширення VS Code з підсвіткою `.potuzhno` |

Власні імена в `.potuzhno` (змінні, функції, класи) перекладач переписує латиницею: `Депутат` → `Deputat`, `імʼя` → `imia`.
У словнику апостроф пишемо як `ʼ` (U+02BC): звичайний `'` у JS відкриває рядок.

## Підсвітка у VS Code

Розширення лежить у тому самому npm-пакеті. Потрібна команда `code` у PATH (у VS Code: «Shell Command: Install 'code' command in PATH»):

```sh
npm install -g potuzhnyi-script
potuzhno vscode
```

З репозиторію розширення збирають так:

```sh
cd editors/vscode
npm install
npm run package
code --install-extension potuzhno-syntax-0.1.0.vsix
```

## Обмеження

У npm іде скомпільований JS: `npm run build` збирає `dist/` через `tsc`, бо Node не стирає типи у файлах з `node_modules`.

---

Слова в бульбашках на сцені — це ключові слова мови, а не цитати людей на фото. [Автори фото](https://maximwas.github.io/potuzhnyi-skrypt/credits/).
