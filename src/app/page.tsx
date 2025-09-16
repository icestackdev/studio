
"use client";

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductListItem } from '@/components/product-list-item';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LayoutGrid, List, Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getProducts } from './actions/product';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const promoImage = PlaceHolderImages.find(img => img.id === 'promo-banner-1');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const {
    items: products,
    hasMore,
    isLoading,
    lastItemRef,
  } = useInfiniteScroll<Product>({
    fetchFunction: getProducts,
    limit: 4,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="relative rounded-lg overflow-hidden h-80">
        {promoImage && (
            <Image
                src={promoImage.imageUrl}
                alt="Summer Collection"
                fill
                className="object-cover w-full h-full"
                data-ai-hint={promoImage.imageHint}
                priority
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 space-y-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold tracking-tight text-white"
            >
              Summer Collection
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/90 max-w-xs"
            >
              Light, airy, and ready for sunshine. Discover our new arrivals.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/categories">
                  <Button className="mt-2" variant="secondary" size="sm">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </Link>
            </motion.div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">New Arrivals</h2>
          <div className="flex items-center gap-1">
            <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setLayout('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setLayout('list')}>
                <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {layout === 'grid' ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {products.map((product, index) => (
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
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                ref={index === products.length - 1 ? lastItemRef : null}
              >
                <ProductListItem product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {isLoading && (
            <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )}
        {!hasMore && products.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">You've reached the end.</p>
        )}
      </div>
    </motion.div>
  );
}
