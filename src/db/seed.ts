import { nanoid } from 'nanoid';
import { db } from './database';
import type { Recipe } from '@/types/recipe';

interface JsonRecipe {
  id: string;
  title: string;
  category: Recipe['category'];
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

const SEED_VERSION = 6;

export async function seedRecipes(): Promise<void> {
  const storedVersion = localStorage.getItem('housemenu_seed_version');
  if (storedVersion === String(SEED_VERSION)) return;

  await db.recipes.clear();
  await db.recipeImages.clear();

  const base = import.meta.env.BASE_URL;
  const response = await fetch(`${base}data/recipes.json`);
  if (!response.ok) return;

  const jsonRecipes: JsonRecipe[] = await response.json();
  const now = Date.now();

  const recipes: Recipe[] = jsonRecipes.map((data, index) => ({
    id: data.id || nanoid(),
    title: data.title,
    category: data.category,
    prepTimeMinutes: data.prepTimeMinutes,
    cookTimeMinutes: data.cookTimeMinutes,
    servings: data.servings,
    description: data.description,
    tags: data.tags,
    source: data.source,
    notes: data.notes,
    image: data.image ? `${base}${data.image}` : undefined,
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

  await db.recipes.bulkAdd(recipes);
  localStorage.setItem('housemenu_seed_version', String(SEED_VERSION));
}
