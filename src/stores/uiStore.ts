import { create } from 'zustand';
import type { MealCategory } from '@/types/recipe';

interface UIState {
  searchQuery: string;
  selectedCategory: MealCategory | 'all';
  selectedTags: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: MealCategory | 'all') => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  selectedTags: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  toggleTag: (tag) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : [...state.selectedTags, tag],
    })),
  clearFilters: () =>
    set({ searchQuery: '', selectedCategory: 'all', selectedTags: [] }),
}));
