
'use client';

import { ProductCard } from '@/components/product-card';
import { ProductListItem } from '@/components/product-list-item';
import { motion } from 'framer-motion';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useCart } from '@/contexts/CartProvider';
import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const t = useTranslations('HomePage');
  const [layout, setLayout] = useState<'grid' | 'list'>('list');
  const { state } = useCart();
  const { products } = state;

  const categories = useMemo(() => {
    const categoryMap = new Map<string, any[]>();
    products.forEach(product => {
      if (!categoryMap.has(product.category)) {
        categoryMap.set(product.category, []);
      }
      categoryMap.get(product.category)!.push(product);
    });
    return Array.from(categoryMap.entries());
  }, [products]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-end gap-2">
            <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('list')}>
                <List className="h-5 w-5" />
            </Button>
        </div>

      {categories.map(([category, categoryProducts], index) => {
        if (categoryProducts.length === 0) return null;
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <div className="sticky top-16 bg-background/95 backdrop-blur-sm z-10 py-2 -mx-4 px-4">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <h2 className="text-xl font-bold tracking-tight">{category}</h2>
                    <Link href={`/categories/${encodeURIComponent(category.toLowerCase().replace(/ /g, '-'))}`} passHref>
                        <Button variant="link" className="text-primary pr-0">{t('viewAll')}</Button>
                    </Link>
                </div>
            </div>

            {layout === 'grid' ? (
                <div className="grid grid-cols-2 gap-4">
                {categoryProducts.slice(0, 4).map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            ) : (
                <div className="space-y-4">
                {categoryProducts.slice(0, 4).map(product => (
                    <ProductListItem key={product.id} product={product} />
                ))}
                </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
