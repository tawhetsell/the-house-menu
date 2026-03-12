import type { IngredientUnit } from '@/types/recipe';

const VOLUME_TO_ML: Partial<Record<IngredientUnit, number>> = {
  tsp: 4.929,
  tbsp: 14.787,
  fl_oz: 29.574,
  cup: 236.588,
  ml: 1,
  l: 1000,
};

const WEIGHT_TO_G: Partial<Record<IngredientUnit, number>> = {
  oz: 28.3495,
  lb: 453.592,
  g: 1,
  kg: 1000,
};

export function convertToCommonUnit(
  qty: number,
  fromUnit: IngredientUnit,
  toUnit: IngredientUnit
): number | null {
  if (fromUnit === toUnit) return qty;

  const fromVol = VOLUME_TO_ML[fromUnit];
  const toVol = VOLUME_TO_ML[toUnit];
  if (fromVol !== undefined && toVol !== undefined) {
    return (qty * fromVol) / toVol;
  }

  const fromWt = WEIGHT_TO_G[fromUnit];
  const toWt = WEIGHT_TO_G[toUnit];
  if (fromWt !== undefined && toWt !== undefined) {
    return (qty * fromWt) / toWt;
  }

  return null;
}

export function getUnitFamily(unit: IngredientUnit): 'volume' | 'weight' | 'count' {
  if (VOLUME_TO_ML[unit] !== undefined) return 'volume';
  if (WEIGHT_TO_G[unit] !== undefined) return 'weight';
  return 'count';
}

export function pickDisplayUnit(
  totalBaseAmount: number,
  family: 'volume' | 'weight'
): { unit: IngredientUnit; quantity: number } {
  if (family === 'volume') {
    // totalBaseAmount is in ml
    if (totalBaseAmount >= 236.588) return { unit: 'cup', quantity: totalBaseAmount / 236.588 };
    if (totalBaseAmount >= 14.787) return { unit: 'tbsp', quantity: totalBaseAmount / 14.787 };
    return { unit: 'tsp', quantity: totalBaseAmount / 4.929 };
  }
  // totalBaseAmount is in grams
  if (totalBaseAmount >= 453.592) return { unit: 'lb', quantity: totalBaseAmount / 453.592 };
  if (totalBaseAmount >= 28.3495) return { unit: 'oz', quantity: totalBaseAmount / 28.3495 };
  return { unit: 'g', quantity: totalBaseAmount };
}

export function formatQuantity(qty: number): string {
  if (qty === 0) return '';

  // Check common fractions
  const remainder = qty % 1;
  const whole = Math.floor(qty);

  if (Math.abs(remainder) < 0.01) return whole.toString();

  const fractions: Array<[number, string]> = [
    [0.125, '1/8'], [0.25, '1/4'], [0.333, '1/3'],
    [0.5, '1/2'], [0.667, '2/3'], [0.75, '3/4'],
  ];

  for (const [val, str] of fractions) {
    if (Math.abs(remainder - val) < 0.05) {
      return whole > 0 ? `${whole} ${str}` : str;
    }
  }

  // Round to 2 decimal places
  return Number(qty.toFixed(2)).toString();
}
