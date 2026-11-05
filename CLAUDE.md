# ПотужнийСкрипт

## Git

- Гілки: `main` — стабільна, `develop` — робоча. Уся робота йде в `develop`, у `main` — тільки через PR із `develop`.
- Повідомлення коммітів і PR (заголовок і опис) — українською.
- Репозиторій: github.com/maximwas/potuzhnyi-skrypt (публічний).

## Випуск в npm

- Пакет `potuzhnyi-script` публікує GitHub Actions (`.github/workflows/npm-publish.yml`) за тегом `vX.Y.Z`, без токенів: npm Trusted Publishing (OIDC). Команда в терміналі після встановлення — `potuzhno`.
- Порядок: `npm version patch -m "Версія %s"` у `develop` (комміт і тег) → PR у `main` → `git push origin vX.Y.Z`. Workflow перевіряє, що тег збігається з версією в `package.json` і що комміт уже в `main`, потім `npm publish` (`prepublishOnly` ганяє `npm run check` і збірку).
- Перший випуск (0.1.0) робить власник вручну: `npm publish` у своєму терміналі (веб-2FA). Після нього, перед наступним випуском, один раз: `npm trust github potuzhnyi-script --file npm-publish.yml --repo maximwas/potuzhnyi-skrypt --allow-publish`. Новий зв'язок діє лише 2 дні до першої успішної публікації, тож виконувати його варто перед самим випуском.
- Тести дочірніх процесів вимикають кольори (`test/support/plain-output-environment.ts`): `npm publish` у кольоровому терміналі інакше ламає порівняння виводу.

## Код

- TypeScript без збірки: Node 26 сам стирає типи. Лише стираний синтаксис (`erasableSyntaxOnly`): без параметрів-властивостей, `enum`, `namespace`. Імпорти з розширенням `.ts`, типи через `import type`.
- ООП і залежності через конструктор (Awilix, `src/container.ts`): один клас на файл, явні поля з `public`/`private`, у конструкторі лише присвоєння. Для тестів залежність можна підмінити.
- Нормальні імена (без `s`, `i`, `res`), по одному запису на рядок, порожній рядок між логічними блоками й навколо кожного `if`/`for`/`try`, перед `return`. Це перевіряє ESLint (`@stylistic/padding-line-between-statements`), решту форматує Prettier.
- Коментар лише про те, чого не видно з коду, українською. Скорочення з відомою межею позначай `shortcut: <межа>, <коли посилити>`.
- Перед «готово»: `npm run check` у корені та `npm test` у `editors/vscode`.
- Код тут пишуть і правлять скриптами (python, heredoc), а не Edit/Write: проєкт у винятках `SCRIPT_WRITE_ROOTS` хука bash-guard.
- Мемні слова з підозрою без вироку (позивні «Мідасу», золоті унітази тощо) ключовими словами не стають.
