'use client';

import { Link, usePathname } from '@/navigation';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartProvider';
import { useTranslations } from 'next-intl';

const navItems = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/categories', labelKey: 'categories', icon: LayoutGrid },
  { href: '/cart', labelKey: 'cart', icon: ShoppingCart },
  { href: '/profile', labelKey: 'profile', icon: User },
];

export function BottomNav() {
  const t = useTranslations('BottomNav');
  const pathname = usePathname();
  const { state } = useCart();
  const cartItemCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40 max-w-lg mx-auto">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.href === '/cart' && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span>{t(item.labelKey as any)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
