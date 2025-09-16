

"use client";

import { useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductListItem } from '@/components/product-list-item';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Link } from '@/navigation';
import { ArrowRight, LayoutGrid, List, Loader2 } from 'lucide-react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { getProducts } from '@/app/actions/product';
import type { Product } from '@/lib/types';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const promoImage = PlaceHolderImages.find(img => img.id === 'promo-banner-1');
  const [layout, setLayout] = useState<'list' | 'list'>('list');
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
      <div className="relative rounded-lg overflow-hidden h-64">
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
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-start justify-end p-6 space-y-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-bold tracking-tight text-white"
            >
              {t('summerCollection')}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/90 max-w-xs"
            >
              {t('summerPromo')}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/categories">
                  <Button className="mt-2" variant="secondary" size="sm">
                      {t('shopNow')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </Link>
            </motion.div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight">{t('newArrivals')}</h2>
          <div className="flex items-center gap-2">
            <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
              {t('viewAll')}
            </Link>
            <div className="flex justify-end gap-1">
                <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setLayout('grid')}>
                    <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setLayout('list')}>
                    <List className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>

        {layout === 'grid' ? (
          <div className="grid grid-cols-2 gap-4">
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
            <p className="text-center text-sm text-muted-foreground py-4">{t('endOfList')}</p>
        )}
      </div>
    </motion.div>
  );
}
