import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRecipe } from '@/hooks/useRecipes';
import { useRecipeImage } from '@/hooks/useRecipeImage';
import { deleteRecipe } from '@/services/recipeService';
import { formatTime, formatTotalTime } from '@/utils/formatting';
import { formatQuantity } from '@/services/unitConversion';
import { MEAL_CATEGORY_LABELS, UNIT_LABELS } from '@/utils/constants';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = useRecipe(id);
  const blobUrl = useRecipeImage(recipe?.imageId);
  const imageUrl = recipe?.image || blobUrl;
  const [servings, setServings] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!recipe) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading recipe...</div>
      </div>
    );
  }

  const currentServings = servings ?? recipe.servings;
  const multiplier = currentServings / recipe.servings;

  const handleDelete = async () => {
    await deleteRecipe(recipe.id);
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Hero Image */}
      {imageUrl && (
        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Title & Meta */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
        {recipe.description && (
          <p className="text-muted-foreground mb-3">{recipe.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{MEAL_CATEGORY_LABELS[recipe.category]}</Badge>
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
          <span>Prep: {formatTime(recipe.prepTimeMinutes)}</span>
          <span>Cook: {formatTime(recipe.cookTimeMinutes)}</span>
          <span className="font-medium text-foreground">
            Total: {formatTotalTime(recipe.prepTimeMinutes, recipe.cookTimeMinutes)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <Link
          to={`/recipe/${recipe.id}/edit`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'no-underline')}
        >
          Edit Recipe
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete
        </Button>
      </div>

      <Separator className="mb-6" />

      {/* Ingredients */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(Math.max(1, currentServings - 1))}
            >
              -
            </Button>
            <span className="min-w-[4rem] text-center text-sm">
              {currentServings} serving{currentServings !== 1 ? 's' : ''}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setServings(currentServings + 1)}
            >
              +
            </Button>
          </div>
        </div>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient) => {
            const scaledQty = ingredient.quantity * multiplier;
            const unitLabel = UNIT_LABELS[ingredient.unit];
            return (
              <li key={ingredient.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  {ingredient.quantity > 0 && (
                    <span className="font-medium">{formatQuantity(scaledQty)} </span>
                  )}
                  {unitLabel && <span>{unitLabel} </span>}
                  <span>{ingredient.name}</span>
                  {ingredient.preparation && (
                    <span className="text-muted-foreground">, {ingredient.preparation}</span>
                  )}
                  {ingredient.optional && (
                    <span className="text-muted-foreground italic"> (optional)</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator className="mb-6" />

      {/* Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step) => (
            <li key={step.order} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {step.order}
              </span>
              <div>
                <p>{step.instruction}</p>
                {step.durationMinutes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    ~{formatTime(step.durationMinutes)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Notes & Source */}
      {(recipe.notes || recipe.source) && (
        <>
          <Separator className="mb-6" />
          <div className="space-y-3">
            {recipe.notes && (
              <div>
                <h3 className="font-semibold mb-1">Notes</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{recipe.notes}</p>
              </div>
            )}
            {recipe.source && (
              <div>
                <h3 className="font-semibold mb-1">Source</h3>
                <p className="text-muted-foreground">{recipe.source}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
