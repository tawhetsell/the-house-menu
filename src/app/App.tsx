import { HashRouter, Routes, Route } from 'react-router';
import { Header } from '@/components/layout/Header';
import { RecipeGrid } from '@/components/recipe/RecipeGrid';
import { RecipeDetail } from '@/components/recipe/RecipeDetail';
import { RecipeForm } from '@/components/form/RecipeForm';
import { GroceryListView } from '@/components/grocery/GroceryListView';

export function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<RecipeGrid />} />
            <Route path="/recipe/new" element={<RecipeForm />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/:id/edit" element={<RecipeForm />} />
            <Route path="/grocery" element={<GroceryListView />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
