import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecipeImage } from '@/hooks/useRecipeImage';
import { formatTotalTime } from '@/utils/formatting';
import { MEAL_CATEGORY_LABELS } from '@/utils/constants';
import type { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const blobUrl = useRecipeImage(recipe.imageId, false);
  const thumbnailUrl = recipe.image || blobUrl;

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={recipe.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
              🍳
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1">{recipe.title}</h3>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {MEAL_CATEGORY_LABELS[recipe.category]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
