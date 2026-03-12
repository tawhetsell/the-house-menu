import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRecipes } from '@/hooks/useRecipes';
import { useRecipeImage } from '@/hooks/useRecipeImage';
import { generateGroceryList } from '@/services/groceryService';
import { formatQuantity } from '@/services/unitConversion';
import { GROCERY_CATEGORY_LABELS, UNIT_LABELS } from '@/utils/constants';
import type { Recipe, GroceryListItem, GroceryCategory } from '@/types/recipe';

function RecipeSelectorCard({
  recipe,
  selected,
  servings,
  onToggle,
  onServingsChange,
}: {
  recipe: Recipe;
  selected: boolean;
  servings: number;
  onToggle: () => void;
  onServingsChange: (s: number) => void;
}) {
  const thumbUrl = useRecipeImage(recipe.imageId, true);

  return (
    <Card
      className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : ''}`}
      onClick={onToggle}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-muted">
            {thumbUrl ? (
              <img src={thumbUrl} alt={recipe.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl">🍳</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm line-clamp-1">{recipe.title}</h3>
              <Checkbox checked={selected} />
            </div>
            {selected && (
              <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-muted-foreground">Servings:</span>
                <Input
                  type="number"
                  min={1}
                  value={servings}
                  onChange={(e) => onServingsChange(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-7 w-16 text-xs"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function GroceryListView() {
  const recipes = useRecipes();
  const [selections, setSelections] = useState<Map<string, number>>(new Map());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [generated, setGenerated] = useState(false);

  const toggleRecipe = (recipeId: string, defaultServings: number) => {
    setSelections((prev) => {
      const next = new Map(prev);
      if (next.has(recipeId)) {
        next.delete(recipeId);
      } else {
        next.set(recipeId, defaultServings);
      }
      return next;
    });
    setGenerated(false);
  };

  const updateServings = (recipeId: string, servings: number) => {
    setSelections((prev) => {
      const next = new Map(prev);
      next.set(recipeId, servings);
      return next;
    });
    setGenerated(false);
  };

  const groceryItems = useMemo(() => {
    if (!recipes || !generated) return null;

    const selectedRecipes = recipes.filter((r) => selections.has(r.id));
    const recipeSelections = selectedRecipes.map((recipe) => ({
      recipe,
      servingsMultiplier: (selections.get(recipe.id) ?? recipe.servings) / recipe.servings,
    }));

    return generateGroceryList(recipeSelections);
  }, [recipes, selections, generated]);

  const groupedItems = useMemo(() => {
    if (!groceryItems) return null;
    const groups = new Map<GroceryCategory, GroceryListItem[]>();
    for (const item of groceryItems) {
      const existing = groups.get(item.category) ?? [];
      existing.push(item);
      groups.set(item.category, existing);
    }
    return groups;
  }, [groceryItems]);

  const toggleChecked = (itemKey: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  if (!recipes) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Grocery List Generator</h1>

      {/* Recipe Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Select meals to shop for</h2>
        {recipes.length === 0 ? (
          <p className="text-muted-foreground">No recipes yet. Add some recipes first!</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeSelectorCard
                key={recipe.id}
                recipe={recipe}
                selected={selections.has(recipe.id)}
                servings={selections.get(recipe.id) ?? recipe.servings}
                onToggle={() => toggleRecipe(recipe.id, recipe.servings)}
                onServingsChange={(s) => updateServings(recipe.id, s)}
              />
            ))}
          </div>
        )}
      </div>

      {selections.size > 0 && (
        <Button
          onClick={() => {
            setGenerated(true);
            setCheckedItems(new Set());
          }}
          className="mb-6"
        >
          Generate Grocery List ({selections.size} meal{selections.size !== 1 ? 's' : ''})
        </Button>
      )}

      {/* Generated Grocery List */}
      {groupedItems && (
        <>
          <Separator className="mb-6" />
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Grocery List</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const text = Array.from(groupedItems.entries())
                  .map(([cat, items]) =>
                    `${GROCERY_CATEGORY_LABELS[cat]}:\n${items
                      .map(
                        (item) =>
                          `  ${formatQuantity(item.totalQuantity)} ${UNIT_LABELS[item.unit]} ${item.ingredientName}`
                      )
                      .join('\n')}`
                  )
                  .join('\n\n');
                navigator.clipboard.writeText(text);
              }}
            >
              Copy to Clipboard
            </Button>
          </div>

          <div className="space-y-6 print:space-y-4">
            {Array.from(groupedItems.entries()).map(([category, items]) => (
              <div key={category}>
                <Badge variant="secondary" className="mb-2">
                  {GROCERY_CATEGORY_LABELS[category]}
                </Badge>
                <ul className="space-y-1.5">
                  {items.map((item) => {
                    const itemKey = `${item.ingredientName}-${item.unit}`;
                    const checked = checkedItems.has(itemKey);
                    return (
                      <li
                        key={itemKey}
                        className={`flex items-center gap-2 cursor-pointer ${checked ? 'line-through text-muted-foreground' : ''}`}
                        onClick={() => toggleChecked(itemKey)}
                      >
                        <Checkbox checked={checked} />
                        <span>
                          {item.totalQuantity > 0 && (
                            <span className="font-medium">
                              {formatQuantity(item.totalQuantity)}{' '}
                            </span>
                          )}
                          {UNIT_LABELS[item.unit] && (
                            <span>{UNIT_LABELS[item.unit]} </span>
                          )}
                          <span>{item.ingredientName}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
