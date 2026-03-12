import { nanoid } from 'nanoid';
import { db } from '@/db/database';
import type { Recipe, MealCategory } from '@/types/recipe';
import { deleteImage } from './imageService';

export async function getAllRecipes(): Promise<Recipe[]> {
  return db.recipes.orderBy('createdAt').reverse().toArray();
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  return db.recipes.get(id);
}

export async function getRecipesByCategory(category: MealCategory): Promise<Recipe[]> {
  return db.recipes.where('category').equals(category).toArray();
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const lower = query.toLowerCase();
  return db.recipes
    .filter(recipe => recipe.title.toLowerCase().includes(lower))
    .toArray();
}

export async function createRecipe(
  data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Recipe> {
  const now = Date.now();
  const recipe: Recipe = {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  };
  await db.recipes.add(recipe);
  return recipe;
}

export async function updateRecipe(
  id: string,
  data: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Promise<void> {
  await db.recipes.update(id, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  const recipe = await db.recipes.get(id);
  if (recipe?.imageId) {
    await deleteImage(recipe.imageId);
  }
  await db.recipes.delete(id);
}

export async function getAllTags(): Promise<string[]> {
  const recipes = await db.recipes.toArray();
  const tagSet = new Set<string>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
