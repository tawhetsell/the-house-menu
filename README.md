# The House Menu

A personal recipe manager and grocery list generator that runs entirely in your browser. Save your household's recipes, browse them by category or tag, and generate consolidated grocery lists from the meals you plan to cook.

## Features

- **Recipe Management** — Create, edit, and delete recipes with ingredients, step-by-step instructions, prep/cook times, servings, tags, and images
- **Search & Filter** — Find recipes by name, filter by meal category (breakfast, lunch, dinner, etc.), or narrow down by tags
- **Image Support** — Upload recipe photos that are automatically compressed and stored locally
- **Grocery List Generator** — Select multiple recipes and generate a combined grocery list with ingredients aggregated, units converted, and items grouped by grocery aisle
- **Offline-First** — All data lives in your browser's IndexedDB. No account, no server, no internet required
- **Dark Mode** — Full light and dark theme support

## Live App

**[https://tawhetsell.github.io/the-house-menu/](https://tawhetsell.github.io/the-house-menu/)**

Deployed automatically to GitHub Pages on every push to `main`.

## Local Development

```bash
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:3000`.

## Built With

- React 19, TypeScript, Vite
- Dexie (IndexedDB) for local storage
- Tailwind CSS + Base UI for styling
- Zustand for UI state
- React Hook Form + Zod for validation
