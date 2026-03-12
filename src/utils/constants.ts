import type { MealCategory, GroceryCategory, IngredientUnit } from '@/types/recipe';

export const MEAL_CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  dessert: 'Dessert',
  appetizer: 'Appetizer',
  side: 'Side',
  drink: 'Drink',
};

export const GROCERY_CATEGORY_LABELS: Record<GroceryCategory, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  meat: 'Meat',
  seafood: 'Seafood',
  bakery: 'Bakery',
  frozen: 'Frozen',
  canned: 'Canned Goods',
  spices: 'Spices & Herbs',
  condiments: 'Condiments',
  grains: 'Grains & Pasta',
  snacks: 'Snacks',
  beverages: 'Beverages',
  other: 'Other',
};

export const UNIT_LABELS: Record<IngredientUnit, string> = {
  tsp: 'tsp',
  tbsp: 'tbsp',
  cup: 'cup',
  fl_oz: 'fl oz',
  ml: 'ml',
  l: 'L',
  oz: 'oz',
  lb: 'lb',
  g: 'g',
  kg: 'kg',
  piece: 'piece',
  slice: 'slice',
  clove: 'clove',
  bunch: 'bunch',
  pinch: 'pinch',
  to_taste: 'to taste',
  can: 'can',
  package: 'package',
  whole: '',
};
