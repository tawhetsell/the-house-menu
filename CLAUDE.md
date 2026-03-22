# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (Vite, http://127.0.0.1:3000)
- `npm run build` — TypeScript check (`tsc -b`) + Vite production build
- `npm run lint` — ESLint (flat config) across all files
- `npm run preview` — Preview production build locally

## Architecture

Fully client-side React SPA with no backend. Recipe data lives in `public/data/recipes.json` and is loaded into IndexedDB (Dexie) at runtime as a session cache. Users export/import JSON files to persist changes.

**Data flow:** `recipes.json` → IndexedDB (Dexie) → Services → React Hooks → Components

- **Data** (`public/data/recipes.json`): Source of truth for recipes. Loaded into IndexedDB on first visit.
- **Database** (`src/db/`): Dexie DB with tables: `recipes`, `recipeImages`, `groceryLists`. Seed logic in `seed.ts` loads from JSON.
- **Services** (`src/services/`): Business logic — recipe CRUD, image compression/storage, ingredient text parsing (regex-based), unit conversion, grocery list aggregation, data export/import (`dataService.ts`).
- **Hooks** (`src/hooks/`): Data access via `useLiveQuery` from dexie-react-hooks for real-time reactivity. `useRecipes`, `useRecipe(id)`, `useAllTags`, `useRecipeImage`.
- **State** (`src/stores/uiStore.ts`): Zustand store for UI-only state (search query, selected category/tags). Not used for data state.
- **Components** (`src/components/`): Organized by domain (`recipe/`, `form/`, `grocery/`, `layout/`) plus `ui/` for styled primitives.
- **Types** (`src/types/`): `recipe.ts` has core domain types; `ai.ts` has PantryItem for future AI features.

## Tech Stack

- React 19 + TypeScript 5.9 (strict mode)
- Vite 7 with React Fast Refresh
- React Router 7 (hash-based routing)
- Dexie 4 (IndexedDB)
- Zustand 5 (UI state)
- React Hook Form + Zod (form validation)
- Tailwind CSS 4 + Base UI React + CVA (styling/components)
- Lucide React (icons), Geist Variable (font)
- browser-image-compression (client-side image optimization)

## Routing

Hash router — no server config needed.

- `/` — Recipe grid
- `/recipe/new` — Create recipe
- `/recipe/:id` — View recipe
- `/recipe/:id/edit` — Edit recipe
- `/grocery` — Grocery list

## Key Patterns

- **Path alias:** `@/*` maps to `./src/*`
- **Forms:** Zod schema → `useForm` with `zodResolver` → `register()` bindings
- **IDs:** Generated with `nanoid`
- **Images:** Seed recipes use URL paths (`recipe.image`). User-uploaded images are compressed client-side (full: 0.5MB/1200px, thumbnail: 0.2MB/600px), stored as blobs in IndexedDB (`recipe.imageId`), served via cached ObjectURLs. Components check `image` first, then fall back to `imageId`.
- **Ingredient parsing:** Regex-based text → structured `Ingredient` (quantity, unit, name, prep). Falls back to `to_taste` if unparseable.
- **Grocery aggregation:** Normalizes names (lowercase, depluralize), converts to base units (ml/g), groups, then converts back to human-readable units
- **UI components:** Base UI primitives wrapped with CVA variants in `src/components/ui/`

## Styling

- Tailwind with oklch color space, green primary (`#16a34a`)
- Full dark mode support
- Custom radius tokens via `--radius` CSS variable
