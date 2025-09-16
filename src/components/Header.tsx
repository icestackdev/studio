
'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartProvider';
import { cn } from '@/lib/utils';
import { Shirt } from 'lucide-react';

export function Header() {
  const { state } = useCart();

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-40 max-w-lg mx-auto bg-background border-b"
      )}
    >
      <div className="flex items-center h-full px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
          <Shirt className="h-6 w-6" />
          <span>{state.shopName}</span>
        </Link>
      </div>
    </header>
  );
}
