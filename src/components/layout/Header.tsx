import { Link, useLocation } from 'react-router';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg no-underline text-foreground">
          <img src="/the-house-menu.png" alt="The House Menu" className="h-8 w-8 object-contain" />
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
        </nav>
      </div>
    </header>
  );
}
