import type { Recipe, GroceryListItem, GroceryCategory, IngredientUnit } from '@/types/recipe';
import { convertToCommonUnit, getUnitFamily, pickDisplayUnit } from './unitConversion';

interface RecipeSelection {
  recipe: Recipe;
  servingsMultiplier: number;
}

interface AggregationKey {
  name: string;
  unit: IngredientUnit;
  family: 'volume' | 'weight' | 'count';
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/e?s$/, ''); // simple plural strip
}

export function generateGroceryList(selections: RecipeSelection[]): GroceryListItem[] {
  const grouped = new Map<string, {
    key: AggregationKey;
    totalBaseAmount: number;
    category: GroceryCategory;
    sourceRecipes: Set<string>;
  }>();

  for (const { recipe, servingsMultiplier } of selections) {
    for (const ingredient of recipe.ingredients) {
      if (ingredient.unit === 'to_taste') continue;

      const normalizedName = normalizeName(ingredient.name);
      const family = getUnitFamily(ingredient.unit);
      const groupKey = `${normalizedName}|${family}`;

      const scaledQty = ingredient.quantity * servingsMultiplier;

      const existing = grouped.get(groupKey);
      if (existing) {
        // Convert to base unit (ml for volume, g for weight, raw for count)
        if (family === 'volume') {
          const inMl = convertToCommonUnit(scaledQty, ingredient.unit, 'ml');
          existing.totalBaseAmount += inMl ?? scaledQty;
        } else if (family === 'weight') {
          const inG = convertToCommonUnit(scaledQty, ingredient.unit, 'g');
          existing.totalBaseAmount += inG ?? scaledQty;
        } else {
          // Count units — only merge if same exact unit
          if (existing.key.unit === ingredient.unit) {
            existing.totalBaseAmount += scaledQty;
          } else {
            // Different count units, create separate entry
            const altKey = `${normalizedName}|${ingredient.unit}`;
            const altExisting = grouped.get(altKey);
            if (altExisting) {
              altExisting.totalBaseAmount += scaledQty;
              altExisting.sourceRecipes.add(recipe.id);
            } else {
              grouped.set(altKey, {
                key: { name: normalizedName, unit: ingredient.unit, family },
                totalBaseAmount: scaledQty,
                category: ingredient.category ?? 'other',
                sourceRecipes: new Set([recipe.id]),
              });
            }
            continue;
          }
        }
        existing.sourceRecipes.add(recipe.id);
      } else {
        let baseAmount = scaledQty;
        if (family === 'volume') {
          baseAmount = convertToCommonUnit(scaledQty, ingredient.unit, 'ml') ?? scaledQty;
        } else if (family === 'weight') {
          baseAmount = convertToCommonUnit(scaledQty, ingredient.unit, 'g') ?? scaledQty;
        }

        grouped.set(groupKey, {
          key: { name: normalizedName, unit: ingredient.unit, family },
          totalBaseAmount: baseAmount,
          category: ingredient.category ?? 'other',
          sourceRecipes: new Set([recipe.id]),
        });
      }
    }
  }

  const items: GroceryListItem[] = [];
  for (const entry of grouped.values()) {
    const { key, totalBaseAmount, category, sourceRecipes } = entry;

    let displayUnit: IngredientUnit;
    let displayQty: number;

    if (key.family === 'volume' || key.family === 'weight') {
      const display = pickDisplayUnit(totalBaseAmount, key.family);
      displayUnit = display.unit;
      displayQty = display.quantity;
    } else {
      displayUnit = key.unit;
      displayQty = totalBaseAmount;
    }

    items.push({
      ingredientName: key.name,
      totalQuantity: displayQty,
      unit: displayUnit,
      category,
      sourceRecipes: [...sourceRecipes],
      checked: false,
    });
  }

  // Sort by grocery category
  const categoryOrder: GroceryCategory[] = [
    'produce', 'meat', 'seafood', 'dairy', 'bakery',
    'grains', 'canned', 'frozen', 'spices', 'condiments',
    'snacks', 'beverages', 'other',
  ];
  items.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));

  return items;
}
