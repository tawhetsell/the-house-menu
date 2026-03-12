import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from './ImageUploader';
import { useRecipe } from '@/hooks/useRecipes';
import { useRecipeImage } from '@/hooks/useRecipeImage';
import { createRecipe, updateRecipe } from '@/services/recipeService';
import { storeImage, deleteImage } from '@/services/imageService';
import { parseIngredient } from '@/services/ingredientParser';
import { MEAL_CATEGORY_LABELS } from '@/utils/constants';
import type { MealCategory, Ingredient, RecipeStep } from '@/types/recipe';

const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  prepTimeMinutes: z.coerce.number().min(0),
  cookTimeMinutes: z.coerce.number().min(0),
  servings: z.coerce.number().min(1),
  category: z.string().min(1, 'Category is required'),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.output<typeof recipeSchema>;

export function RecipeForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const existingRecipe = useRecipe(id);
  const existingImageUrl = useRecipeImage(existingRecipe?.imageId);
  const isEditing = Boolean(id);

  const [ingredientLines, setIngredientLines] = useState<Array<{ key: string; text: string }>>([
    { key: nanoid(), text: '' },
  ]);
  const [stepLines, setStepLines] = useState<Array<{ key: string; text: string }>>([
    { key: nanoid(), text: '' },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 4,
      category: 'dinner',
      source: '',
      notes: '',
      tags: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (!existingRecipe) return;
    setValue('title', existingRecipe.title);
    setValue('description', existingRecipe.description ?? '');
    setValue('prepTimeMinutes', existingRecipe.prepTimeMinutes);
    setValue('cookTimeMinutes', existingRecipe.cookTimeMinutes);
    setValue('servings', existingRecipe.servings);
    setValue('category', existingRecipe.category);
    setValue('source', existingRecipe.source ?? '');
    setValue('notes', existingRecipe.notes ?? '');
    setValue('tags', existingRecipe.tags.join(', '));
    setIngredientLines(
      existingRecipe.ingredients.map((ing) => ({
        key: ing.id,
        text: ing.originalText,
      }))
    );
    setStepLines(
      existingRecipe.steps.map((step) => ({
        key: nanoid(),
        text: step.instruction,
      }))
    );
  }, [existingRecipe, setValue]);

  const addIngredientLine = () => {
    setIngredientLines((prev) => [...prev, { key: nanoid(), text: '' }]);
  };

  const removeIngredientLine = (key: string) => {
    setIngredientLines((prev) => prev.filter((l) => l.key !== key));
  };

  const updateIngredientLine = (key: string, text: string) => {
    setIngredientLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, text } : l))
    );
  };

  const addStepLine = () => {
    setStepLines((prev) => [...prev, { key: nanoid(), text: '' }]);
  };

  const removeStepLine = (key: string) => {
    setStepLines((prev) => prev.filter((l) => l.key !== key));
  };

  const updateStepLine = (key: string, text: string) => {
    setStepLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, text } : l))
    );
  };

  const onSubmit = async (data: Record<string, unknown>) => {
    const parsed = recipeSchema.parse(data) as FormData;
    setSaving(true);
    try {
      // Parse ingredients
      const ingredients: Ingredient[] = ingredientLines
        .filter((l) => l.text.trim())
        .map((l) => parseIngredient(l.text));

      // Parse steps
      const steps: RecipeStep[] = stepLines
        .filter((l) => l.text.trim())
        .map((l, i) => ({ order: i + 1, instruction: l.text.trim() }));

      // Parse tags
      const tags = (parsed.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      // Handle image
      let imageId = existingRecipe?.imageId;
      if (removeImage && imageId) {
        await deleteImage(imageId);
        imageId = undefined;
      }
      if (imageFile) {
        if (imageId) await deleteImage(imageId);
        imageId = await storeImage(imageFile);
      }

      const recipeData = {
        title: parsed.title,
        description: parsed.description || undefined,
        imageId,
        ingredients,
        steps,
        prepTimeMinutes: parsed.prepTimeMinutes,
        cookTimeMinutes: parsed.cookTimeMinutes,
        servings: parsed.servings,
        tags,
        category: parsed.category as MealCategory,
        source: parsed.source || undefined,
        notes: parsed.notes || undefined,
      };

      if (isEditing && id) {
        await updateRecipe(id, recipeData);
        navigate(`/recipe/${id}`);
      } else {
        const recipe = await createRecipe(recipeData);
        navigate(`/recipe/${recipe.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image */}
        <div>
          <Label>Photo</Label>
          <div className="mt-1.5">
            <ImageUploader
              currentImageUrl={isEditing ? existingImageUrl : null}
              onImageSelect={(file) => {
                setImageFile(file);
                setRemoveImage(false);
              }}
              onImageRemove={() => {
                setImageFile(null);
                setRemoveImage(true);
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register('title')} className="mt-1.5" />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} className="mt-1.5" rows={2} />
        </div>

        {/* Category */}
        <div>
          <Label>Category *</Label>
          <Select
            defaultValue={existingRecipe?.category ?? 'dinner'}
            onValueChange={(val) => { if (val) setValue('category', val); }}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MEAL_CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Times & Servings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prepTime">Prep Time (min)</Label>
            <Input
              id="prepTime"
              type="number"
              min={0}
              {...register('prepTimeMinutes')}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="cookTime">Cook Time (min)</Label>
            <Input
              id="cookTime"
              type="number"
              min={0}
              {...register('cookTimeMinutes')}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="servings">Servings</Label>
            <Input
              id="servings"
              type="number"
              min={1}
              {...register('servings')}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <Label>Ingredients</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Enter each ingredient (e.g., "2 cups flour, sifted")
          </p>
          <div className="space-y-2">
            {ingredientLines.map((line) => (
              <div key={line.key} className="flex gap-2">
                <Input
                  value={line.text}
                  onChange={(e) => updateIngredientLine(line.key, e.target.value)}
                  placeholder="2 cups all-purpose flour"
                />
                {ingredientLines.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredientLine(line.key)}
                    className="shrink-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addIngredientLine} className="mt-2">
            + Add Ingredient
          </Button>
        </div>

        {/* Steps */}
        <div>
          <Label>Instructions</Label>
          <div className="space-y-2 mt-1.5">
            {stepLines.map((line, index) => (
              <div key={line.key} className="flex gap-2">
                <span className="flex h-9 w-7 shrink-0 items-center justify-center text-sm text-muted-foreground">
                  {index + 1}.
                </span>
                <Textarea
                  value={line.text}
                  onChange={(e) => updateStepLine(line.key, e.target.value)}
                  placeholder="Describe this step..."
                  rows={2}
                />
                {stepLines.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStepLine(line.key)}
                    className="shrink-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addStepLine} className="mt-2">
            + Add Step
          </Button>
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            {...register('tags')}
            placeholder="quick, weeknight, italian"
            className="mt-1.5"
          />
          <p className="text-sm text-muted-foreground mt-1">Comma-separated</p>
        </div>

        {/* Source */}
        <div>
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            {...register('source')}
            placeholder="URL or cookbook reference"
            className="mt-1.5"
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register('notes')} className="mt-1.5" rows={3} />
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Recipe'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
