
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartProvider';
import { cn } from '@/lib/utils';

export function Header() {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 z-40 max-w-lg mx-auto transition-all duration-300",
        isScrolled ? "bg-background/90 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-center h-full px-4">
        <Link href="/" className="text-lg font-bold tracking-tight transition-colors"
          style={{ color: isScrolled ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}
        >
          {state.shopName}
        </Link>
      </div>
    </header>
  );
}
