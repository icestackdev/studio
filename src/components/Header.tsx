
'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartProvider';
import { cn } from '@/lib/utils';
import { Menu, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export function Header() {
  const { state } = useCart();
  const pathname = usePathname();
  const cartItemCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isCartPage = pathname === '/cart';

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-40 max-w-lg mx-auto bg-background/80 backdrop-blur-sm border-b"
      )}
    >
      <div className="flex items-center justify-between h-full px-4">
        <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span>{state.shopName}</span>
        </Link>
        <Link href="/cart" passHref>
          <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {cartItemCount}
                </span>
              )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
