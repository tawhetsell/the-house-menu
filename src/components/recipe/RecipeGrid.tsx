import { useMemo } from 'react';
import { Link } from 'react-router';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RecipeCard } from './RecipeCard';
import { useRecipes, useAllTags } from '@/hooks/useRecipes';
import { useUIStore } from '@/stores/uiStore';
import { MEAL_CATEGORY_LABELS } from '@/utils/constants';
import type { MealCategory } from '@/types/recipe';

const CATEGORIES: Array<MealCategory | 'all'> = [
  'all', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'appetizer', 'side', 'drink',
];

export function RecipeGrid() {
  const recipes = useRecipes();
  const allTags = useAllTags();
  const { searchQuery, selectedCategory, selectedTags, setSearchQuery, setSelectedCategory, toggleTag, clearFilters } = useUIStore();

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    return recipes.filter((recipe) => {
      if (searchQuery && !recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
        return false;
      }
      if (selectedTags.length > 0 && !selectedTags.some((tag) => recipe.tags.includes(tag))) {
        return false;
      }
      return true;
    });
  }, [recipes, searchQuery, selectedCategory, selectedTags]);

  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedTags.length > 0;

  if (recipes === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All' : MEAL_CATEGORY_LABELS[cat]}
            </Badge>
          ))}
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold mb-2">Your menu is empty</h2>
          <p className="text-muted-foreground mb-4">
            Start building The House Menu by adding your first recipe.
          </p>
          <Link
            to="/recipe/new"
            className={cn(buttonVariants(), 'no-underline')}
          >
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No recipes match your filters.</p>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
