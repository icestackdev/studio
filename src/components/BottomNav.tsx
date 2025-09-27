'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartProvider';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/profile', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { state } = useCart();
  const cartItemCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-sm border-t z-40 max-w-lg mx-auto">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCart = item.href === '/cart';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors relative',
                isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive ? 'fill-current' : '')} />
              <span>{item.label}</span>
              {isCart && cartItemCount > 0 && (
                <span className="absolute top-3 right-5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {cartItemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
