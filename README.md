# Crypto Market Table (Vue 3 + TypeScript + Pinia)

A crypto market table with periodic updates, error handling, skeleton loading states, search/filtering, and mini line charts.

- **Stack:** Vue 3, TypeScript, Pinia, Vite, Chart.js, zod, ofetch

## Features
- Fetch and display market quotes
- Polling with retry on error
- Skeletons during loading; simple error banner with retry button
- Search/filter by id; basic sorting (by price, id)
- Compact sparkline charts for price history

## Getting Started
```bash
# Install pnpm if not installed
npm i -g pnpm

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type-check
pnpm typecheck

# Production build
pnpm build

# Preview built app
pnpm preview
```

## Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && vue-tsc --noEmit",
    "preview": "vite preview",
    "typecheck": "vue-tsc --noEmit"
  }
}
```

## Project Structure (short)
```bash
src/
  app/         # app bootstrap, global handlers
  features/    # user-facing flows (market table)
  entities/    # domain (coin): api, dto, mappers, ui
  shared/      # services, composables, ui building blocks, plugins
  store/       # global state (Pinia)
```

## Architecture Notes
- **Data flow:** API → validation (zod) → mapping → store → UI
- **Error handling:** simple composable for async state + global handler for unhandled rejections
- **Polling:** small service with interval control and restart/stop

I tried to keep the architecture modular and not overengineered, but still clear enough for scaling.

## Key Decisions
- **Map for store state:** O(1) lookups/updates. Sorting is done via computed values.
- **Polling service:** isolated for reuse and testing.
- **Error handling:** one place to plug in logging or monitoring later.

## Manual QA Scenarios
- Initial load → skeleton → data renders fine.
- Error on load → error banner shown, retry works.
- Polling → updates without duplicate requests.
- Search → filters by id, empty state handled.
- Charts → show history without jitter.

## Roadmap / Things to Improve
- Add more sorting types (price change %, volume). I wanted to implement this but codebase was already growing fast, so I kept it minimal.
- Stricter TypeScript settings.
- Path aliases (@/*) and lint/prettier config.

## Troubleshooting
- **Proxy issues:** check `VITE_API_BASE` and dev server proxy rules.
- **Type-check fails:** verify external types are installed.

---
MIT License (or update accordingly)
