import { db } from '@/db/database';
import type { Recipe } from '@/types/recipe';
import { nanoid } from 'nanoid';

interface ExportRecipe {
  id: string;
  title: string;
  category: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  description?: string;
  tags: string[];
  source?: string;
  notes?: string;
  image?: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    originalText: string;
    preparation?: string;
    category?: string;
    optional?: boolean;
  }>;
  steps: Array<{
    order: number;
    instruction: string;
    durationMinutes?: number;
  }>;
}

export async function exportRecipes(): Promise<void> {
  const recipes = await db.recipes.toArray();

  const exportData: ExportRecipe[] = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    description: recipe.description,
    tags: recipe.tags,
    source: recipe.source,
    notes: recipe.notes,
    image: recipe.image,
    ingredients: recipe.ingredients.map((ing) => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      originalText: ing.originalText,
      preparation: ing.preparation,
      category: ing.category,
      optional: ing.optional,
    })),
    steps: recipe.steps,
  }));

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'recipes.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importRecipes(file: File): Promise<number> {
  const text = await file.text();
  const jsonRecipes: ExportRecipe[] = JSON.parse(text);
  const now = Date.now();

  const recipes: Recipe[] = jsonRecipes.map((data, index) => ({
    id: data.id || nanoid(),
    title: data.title,
    category: data.category as Recipe['category'],
    prepTimeMinutes: data.prepTimeMinutes,
    cookTimeMinutes: data.cookTimeMinutes,
    servings: data.servings,
    description: data.description,
    tags: data.tags,
    source: data.source,
    notes: data.notes,
    image: data.image,
    ingredients: data.ingredients.map((ing) => ({
      id: nanoid(),
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit as Recipe['ingredients'][0]['unit'],
      originalText: ing.originalText,
      preparation: ing.preparation,
      category: ing.category as Recipe['ingredients'][0]['category'],
      optional: ing.optional,
    })),
    steps: data.steps,
    createdAt: now - index * 1000,
    updatedAt: now - index * 1000,
  }));

  await db.recipes.clear();
  await db.recipeImages.clear();
  await db.recipes.bulkAdd(recipes);

  return recipes.length;
}
