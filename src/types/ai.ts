import type { IngredientUnit } from './recipe';

export interface PantryItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: IngredientUnit;
  expiresAt?: number;
  detectedFrom?: 'manual' | 'ai_image';
  confidence?: number;
}
