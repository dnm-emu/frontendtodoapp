# DayList — Vue 3 + Quasar

## Возможности

- Создание задач с приоритетом, переключение статуса и удаление
- Фильтры: все / в работе / сделано, поиск по названию
- Статистика на доске
- Вход через mock API и запасной локальный режим (GitHub Pages)
- Защита маршрутов, хлебные крошки, ленивая загрузка страниц
- Светлая и тёмная тема
- Сохранение сессии, темы и задач в localStorage
- Валидация Zod, централизованные ошибки, retry и кэш GET-запросов
- Vitest + Vue Test Utils
- CI и публикация на GitHub Pages

## Стек

Vue 3 Composition API, TypeScript strict, Quasar, Pinia, Vue Router 4, Axios, Zod, JSON Server, GitHub Actions.

## Запуск

Нужны Node.js 20+ и npm 9+.

```bash
npm install
cd mock && npm install && cd ..
npm run mock
```

Во втором терминале:

```bash
npm run dev
```

Приложение: `http://localhost:9000`. Mock API: `http://localhost:3001`.

Учётные записи:

- `user@test.com` / `123456`
- `admin@test.com` / `admin123`

## Скрипты

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Dev-сервер |
| `npm run mock` | Локальный API |
| `npm run build` | Сборка `dist/spa` |
| `npm run typecheck` | Проверка TypeScript |
| `npm test` | Тесты |
| `npm run test:coverage` | Покрытие |

## GitHub Pages

1. Создайте репозиторий и загрузите содержимое этой папки в корень.
2. Settings → Pages → Source: **GitHub Actions**.
3. После push в `main` или `master` workflow соберёт сайт.

На GitHub Pages mock-сервера нет: вход работает в локальном режиме, задачи хранятся в браузере.

## Тесты

```
tests/unit/utils
tests/unit/stores
tests/unit/composables
tests/components
```
