# Сайт ПотужногоСкрипта

Одна сторінка: що це, пробний майданчик, словник і «Як почати». Next.js 16 (App Router), Tailwind 4,
Motion, статичний експорт для GitHub Pages. Увесь текст українською.

## Команди

Спершу `npm ci` у корені репозиторію (сайт імпортує `src/` кореня) і в `site/`.

```sh
npm run dev        # розробка
npm run build      # статичний експорт у site/out
npm run lint
npm run typecheck
npm run test       # node --test, логіка пошуку словника
```

## Звідки дані

Словник береться під час збірки з `src/dictionary/entries/*.ts` через аліас `@core/*`; слова не дублюються, кількість не прописана вручну. Підсвітка й підказки редактора — з `editors/vscode`
(`@extension/*`).

## Base path

Сайт живе на `https://<користувач>.github.io/<репозиторій>/`, тож у CI `SITE_BASE_PATH` береться
з `configure-pages`. Локально змінна порожня. Файли з `public/` і `metadata.icons` базового шляху
самі не отримують: обгортайте їх у `withBasePath` (`src/lib/with-base-path.ts`).

## Публікація

1. Один раз: Settings → Pages → Source → «GitHub Actions».
2. Далі `.github/workflows/site.yml` збирає й викладає сайт при пуші в `main`
   (зміни в `site/`, `src/`, `editors/vscode/`) або вручну (`workflow_dispatch`).

Pages із приватного репозиторію потребує платного плану (Pro, Team чи Enterprise Cloud), а
опублікований сайт усе одно публічний. На Free репозиторій має бути публічним.
