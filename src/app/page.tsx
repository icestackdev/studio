
"use client";

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getProducts } from './actions/product';
import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartProvider';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const promoImage = PlaceHolderImages.find(img => img.id === 'promo-banner-1');
  const { state } = useCart();
  const { categories } = state;
  const [activeCategory, setActiveCategory] = useState('All');

  const {
    items: products,
    hasMore,
    isLoading,
    lastItemRef,
  } = useInfiniteScroll<Product>({
    fetchFunction: getProducts,
    limit: 4,
  });

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'All') return true;
    return product.category === activeCategory;
  })

  return (
    <div className="relative max-w-lg mx-auto bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-24 px-4 space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 h-12 rounded-full bg-secondary text-base" />
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9">
                    <ListFilter className="h-5 w-5" />
                </Button>
            </div>
        
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold tracking-tight">Categories</h2>
                    <Link href="/categories">
                        <Button variant="link" className="text-primary pr-0">See All</Button>
                    </Link>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <Button 
                        variant={activeCategory === 'All' ? 'default' : 'secondary'} 
                        className="rounded-full"
                        onClick={() => setActiveCategory('All')}
                    >
                        All
                    </Button>
                    {categories.slice(0, 3).map(cat => (
                        <Button 
                            key={cat}
                            variant={activeCategory === cat ? 'default' : 'secondary'} 
                            className="rounded-full whitespace-nowrap"
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {promoImage && (
                <div className="relative rounded-xl overflow-hidden h-40 bg-orange-100">
                     <Image
                        src={promoImage.imageUrl}
                        alt="Special Sale"
                        fill
                        className="object-cover w-full h-full object-right"
                        data-ai-hint={promoImage.imageHint}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/50 via-orange-500/80 to-orange-600/90" />
                    <div className="absolute inset-0 flex flex-col items-start justify-center p-6 space-y-1">
                        <h2 className="text-xl font-bold tracking-tight text-white">Get Your Special Sale</h2>
                        <p className="font-semibold text-white">Up to 40%</p>
                         <Button className="mt-2" variant="secondary" size="sm">
                            Shop Now
                        </Button>
                    </div>
                </div>
            )}
            
            <div>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold tracking-tight">Popular Product</h2>
                <Link href="/categories">
                    <Button variant="link" className="text-primary pr-0">See All</Button>
                </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        ref={index === products.length - 1 ? lastItemRef : null}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                    ))}
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-4 col-span-2">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!hasMore && products.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4 col-span-2">You've reached the end.</p>
                )}
            </div>
        </main>
        <BottomNav />
    </div>
  );
}
