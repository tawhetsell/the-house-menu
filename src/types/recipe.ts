export type IngredientUnit =
  | 'tsp' | 'tbsp' | 'cup' | 'fl_oz'
  | 'ml' | 'l'
  | 'oz' | 'lb' | 'g' | 'kg'
  | 'piece' | 'slice' | 'clove' | 'bunch'
  | 'pinch' | 'to_taste'
  | 'can' | 'package'
  | 'whole';

export type GroceryCategory =
  | 'produce' | 'dairy' | 'meat' | 'seafood'
  | 'bakery' | 'frozen' | 'canned'
  | 'spices' | 'condiments' | 'grains'
  | 'snacks' | 'beverages' | 'other';

export type MealCategory =
  | 'breakfast' | 'lunch' | 'dinner' | 'snack'
  | 'dessert' | 'appetizer' | 'side' | 'drink';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  originalText: string;
  preparation?: string;
  category?: GroceryCategory;
  optional?: boolean;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  durationMinutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageId?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  tags: string[];
  category: MealCategory;
  source?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface RecipeImage {
  id: string;
  blob: Blob;
  thumbnailBlob: Blob;
  mimeType: string;
  createdAt: number;
}

export interface GroceryListItem {
  ingredientName: string;
  totalQuantity: number;
  unit: IngredientUnit;
  category: GroceryCategory;
  sourceRecipes: string[];
  checked: boolean;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryListItem[];
  selectedRecipes: Array<{
    recipeId: string;
    servingsMultiplier: number;
  }>;
  createdAt: number;
}
