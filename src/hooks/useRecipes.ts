import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/database';
import type { Recipe } from '@/types/recipe';

export function useRecipes(): Recipe[] | undefined {
  return useLiveQuery(() => db.recipes.orderBy('createdAt').reverse().toArray());
}

export function useRecipe(id: string | undefined): Recipe | undefined {
  return useLiveQuery(
    () => (id ? db.recipes.get(id) : undefined),
    [id]
  );
}

export function useAllTags(): string[] {
  const tags = useLiveQuery(async () => {
    const recipes = await db.recipes.toArray();
    const tagSet = new Set<string>();
    for (const recipe of recipes) {
      for (const tag of recipe.tags) {
        tagSet.add(tag);
      }
    }
    return [...tagSet].sort();
  });
  return tags ?? [];
}
