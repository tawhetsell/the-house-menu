import { useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { exportRecipes, importRecipes } from '@/services/dataService';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    await exportRecipes();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const count = await importRecipes(file);
    alert(`Imported ${count} recipes`);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg no-underline text-foreground">
          <img src={`${import.meta.env.BASE_URL}the-house-menu.png`} alt="The House Menu" className="h-8 w-8 object-contain" />
          <span>The House Menu</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: isHome ? 'default' : 'ghost', size: 'sm' }),
              'no-underline'
            )}
          >
            Menu
          </Link>
          <Link
            to="/grocery"
            className={cn(
              buttonVariants({
                variant: location.pathname.startsWith('/grocery') ? 'default' : 'ghost',
                size: 'sm',
              }),
              'no-underline'
            )}
          >
            Grocery List
          </Link>
          <Link
            to="/recipe/new"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'no-underline')}
          >
            + Add Recipe
          </Link>
          <Button variant="ghost" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </nav>
      </div>
    </header>
  );
}
