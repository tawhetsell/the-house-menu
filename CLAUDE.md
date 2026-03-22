# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (Vite, http://127.0.0.1:3000)
- `npm run build` — TypeScript check (`tsc -b`) + Vite production build
- `npm run lint` — ESLint (flat config) across all files
- `npm run preview` — Preview production build locally

## Architecture

Fully client-side React SPA with no backend. Data persists in IndexedDB via Dexie.

**Data flow:** IndexedDB (Dexie) → Services → React Hooks → Components

- **Database** (`src/db/`): Dexie DB with tables: `recipes`, `recipeImages`, `groceryLists`. Seed data in `seed.ts`.
- **Services** (`src/services/`): Business logic — recipe CRUD, image compression/storage, ingredient text parsing (regex-based), unit conversion, grocery list aggregation.
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
- **Images:** Compressed client-side (full: 0.5MB/1200px, thumbnail: 0.2MB/600px), stored as blobs in IndexedDB, served via cached ObjectURLs
- **Ingredient parsing:** Regex-based text → structured `Ingredient` (quantity, unit, name, prep). Falls back to `to_taste` if unparseable.
- **Grocery aggregation:** Normalizes names (lowercase, depluralize), converts to base units (ml/g), groups, then converts back to human-readable units
- **UI components:** Base UI primitives wrapped with CVA variants in `src/components/ui/`

## Styling

- Tailwind with oklch color space, green primary (`#16a34a`)
- Full dark mode support
- Custom radius tokens via `--radius` CSS variable
