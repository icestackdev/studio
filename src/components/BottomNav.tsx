'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cart', label: 'Shopping', icon: ShoppingBag },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/profile', label: 'Account', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/95 backdrop-blur-sm border-t z-40 max-w-lg mx-auto">
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
              <item.icon className={cn("w-6 h-6", isActive ? 'fill-current' : '')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
