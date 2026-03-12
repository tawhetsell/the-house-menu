import Dexie, { type Table } from 'dexie';
import type { Recipe, RecipeImage, GroceryList } from '@/types/recipe';

export class HouseMenuDB extends Dexie {
  recipes!: Table<Recipe, string>;
  recipeImages!: Table<RecipeImage, string>;
  groceryLists!: Table<GroceryList, string>;

  constructor() {
    super('HouseMenuDB');
    this.version(1).stores({
      recipes: 'id, title, category, createdAt, *tags',
      recipeImages: 'id',
      groceryLists: 'id, createdAt',
    });
  }
}

export const db = new HouseMenuDB();
