# The House Menu

A personal recipe manager and grocery list generator that runs entirely in your browser. Save your household's recipes, browse them by category or tag, and generate consolidated grocery lists from the meals you plan to cook.

## Features

- **Recipe Management** — Create, edit, and delete recipes with ingredients, step-by-step instructions, prep/cook times, servings, tags, and images
- **Search & Filter** — Find recipes by name, filter by meal category (breakfast, lunch, dinner, etc.), or narrow down by tags
- **Image Support** — Upload recipe photos that are automatically compressed and stored locally
- **Grocery List Generator** — Select multiple recipes and generate a combined grocery list with ingredients aggregated, units converted, and items grouped by grocery aisle
- **Export / Import** — Export your recipes as a JSON file, import them on any device. Your data is yours
- **Dark Mode** — Full light and dark theme support

## Live Demo

**[https://tawhetsell.github.io/the-house-menu/](https://tawhetsell.github.io/the-house-menu/)**

The live site is a read-only demonstration. To add and manage your own recipes, run the app locally.

## Running Locally

```bash
npm install
npm run dev
```

The dev server runs at `http://127.0.0.1:3000`. On Windows, you can also use `dev.bat`.

Recipes are stored in `public/data/recipes.json`. To save your changes:

1. Add or edit recipes in the app
2. Click **Export** to download your updated `recipes.json`
3. Replace `public/data/recipes.json` with the exported file

## Built With

- React 19, TypeScript, Vite
- Dexie (IndexedDB) for local storage
- Tailwind CSS + Base UI for styling
- Zustand for UI state
- React Hook Form + Zod for validation
