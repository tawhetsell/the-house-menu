import { nanoid } from 'nanoid';
import type { Ingredient, IngredientUnit } from '@/types/recipe';

const UNIT_MAP: Record<string, IngredientUnit> = {
  tsp: 'tsp', teaspoon: 'tsp', teaspoons: 'tsp',
  tbsp: 'tbsp', tablespoon: 'tbsp', tablespoons: 'tbsp',
  cup: 'cup', cups: 'cup',
  'fl oz': 'fl_oz', 'fluid ounce': 'fl_oz', 'fluid ounces': 'fl_oz',
  oz: 'oz', ounce: 'oz', ounces: 'oz',
  lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb',
  g: 'g', gram: 'g', grams: 'g',
  kg: 'kg', kilogram: 'kg', kilograms: 'kg',
  ml: 'ml', milliliter: 'ml', milliliters: 'ml',
  l: 'l', liter: 'l', liters: 'l',
  clove: 'clove', cloves: 'clove',
  bunch: 'bunch', bunches: 'bunch',
  slice: 'slice', slices: 'slice',
  piece: 'piece', pieces: 'piece',
  pinch: 'pinch',
  can: 'can', cans: 'can',
  package: 'package', packages: 'package', pkg: 'package',
  whole: 'whole',
};

const UNIT_PATTERN = Object.keys(UNIT_MAP)
  .sort((a, b) => b.length - a.length)
  .join('|');

const INGREDIENT_REGEX = new RegExp(
  `^(?<qty>\\d+\\s*\\/\\s*\\d+|\\d+\\s+\\d+\\s*\\/\\s*\\d+|\\d+\\.?\\d*)\\s*(?<unit>${UNIT_PATTERN})\\.?\\s+(?<name>.+?)(?:,\\s*(?<prep>.+))?$`,
  'i'
);

const QTY_ONLY_REGEX = /^(?<qty>\d+\s*\/\s*\d+|\d+\s+\d+\s*\/\s*\d+|\d+\.?\d*)\s+(?<name>.+?)(?:,\s*(?<prep>.+))?$/i;

function parseFraction(s: string): number {
  s = s.trim();
  // Mixed number: "2 1/2"
  const mixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);
  }
  // Fraction: "1/2"
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (frac) {
    return parseInt(frac[1]) / parseInt(frac[2]);
  }
  return parseFloat(s) || 0;
}

export function parseIngredient(text: string): Ingredient {
  const trimmed = text.trim();

  // Try full match: quantity + unit + name
  const match = trimmed.match(INGREDIENT_REGEX);
  if (match?.groups) {
    const unitKey = match.groups.unit.toLowerCase();
    return {
      id: nanoid(),
      name: match.groups.name.trim(),
      quantity: parseFraction(match.groups.qty),
      unit: UNIT_MAP[unitKey] ?? 'whole',
      originalText: trimmed,
      preparation: match.groups.prep?.trim(),
    };
  }

  // Try quantity + name (no unit)
  const qtyMatch = trimmed.match(QTY_ONLY_REGEX);
  if (qtyMatch?.groups) {
    return {
      id: nanoid(),
      name: qtyMatch.groups.name.trim(),
      quantity: parseFraction(qtyMatch.groups.qty),
      unit: 'whole',
      originalText: trimmed,
      preparation: qtyMatch.groups.prep?.trim(),
    };
  }

  // Fallback: treat whole string as name
  return {
    id: nanoid(),
    name: trimmed,
    quantity: 0,
    unit: 'to_taste',
    originalText: trimmed,
  };
}
