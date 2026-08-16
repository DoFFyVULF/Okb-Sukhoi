# ОКБ СУХОГО

Одностраничный лендинг конструкторского бюро Сухого — в стиле «авиационный HUD / инженерный чертёж»: тёмная тема, тонкие сеточные линии, кинематографичные анимации самолётов, счётчики и scroll-сцены.

> ⚠️ Неофициальный фан-проект. Не аффилирован с АО «Компания „Сухой"» и Объединённой авиастроительной корпорацией (ОАК).

## Стек

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** — вся дизайн-система (токены, keyframes) в `app/globals.css`
- **Framer Motion** — scroll-привязка (`useScroll` / `useTransform`), появление секций
- **lucide-react** — иконки
- **next/font** + Google Fonts — Russo One (заголовки), Manrope (текст), JetBrains Mono (ТТХ/цифры)
- **Sketchfab Viewer API** — интерактивная 3D-модель Су-57 в hero

## Особенности

- **Runtime alpha-matting** (`lib/matting.ts`): PNG-самолёты с белым фоном грузятся
  с CDN (`image.qwenlm.ai`), а белый фон срезается на клиенте flood-fill-заливкой
  от краёв — самолёты рендерятся прозрачными поверх тёмного интерфейса.
- Прелоадер с радаром, бесконечная MARQUEE-лента, таймлайн истории, карточки
  семейства «Су», полноэкранная scroll-сцена пролёта, секции вооружения и галереи.
- Полное уважение к `prefers-reduced-motion`: бесконечные анимации отключаются.

## Запуск

```bash
npm install      # установить зависимости
npm run dev      # дев-сервер → http://localhost:3000
npm run build    # production-сборка
npm start        # запуск production-сборки
npm run lint     # ESLint
```

## Структура

```
app/
  layout.tsx     метаданные, шрифты, <body>
  page.tsx       композиция всех секций
  globals.css    design-system, токены, keyframes
components/      секции: Preloader, Navbar, Hero, Marquee, History,
                 Fleet, FlightScene, Weapons, Gallery, Footer (+ Reveal)
data/
  content.ts     весь контент: самолёты, таймлайн, вооружение, галерея, URL картинок
lib/
  matting.ts     runtime alpha-matting PNG (срезка белого фона)
  sketchfab.ts   интеграция 3D-вьювера Су-57 (scroll-orbit, free-look)
  hooks.ts       useScramble, useCountUp, useReveal, useMediaQuery и др.
legacy/          оригинальная vanilla-версия (index.html, server.js) — для истории
```

## Секции (сверху вниз)

Прелоадер → Навбар → **Hero** (3D Су-57 + телеметрия) → MARQUEE →
**История** (таймлайн по скроллу) → **Самолёты** (карточки семейства «Су») →
**Пролёт** (scroll-сцена) → **Вооружение** → **Галерея** → Footer.
