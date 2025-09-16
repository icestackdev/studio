
'use client';

import { ProductCard } from '@/components/product-card';
import { ProductListItem } from '@/components/product-list-item';
import { products } from '@/lib/products';
import { motion } from 'framer-motion';
import { notFound, useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const { category: categorySlug } = params;
  const [layout, setLayout] = useState<'grid' | 'list'>('list');

  const categoryName = useMemo(() => {
    if (typeof categorySlug !== 'string') return null;
    const name = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    // A real app would validate this against a list of actual categories
    return name.replace('-', ' ');
  }, [categorySlug]);

  const categoryProducts = useMemo(
    () =>
      products.filter(
        (p) => p.category.toLowerCase() === (categoryName || '').toLowerCase()
      ),
    [categoryName]
  );

  if (!categoryName || categoryProducts.length === 0) {
    notFound();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.back()}
            >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{categoryName}</h1>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setLayout('list')}>
                <List className="h-5 w-5" />
            </Button>
        </div>
      </div>
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-4">
            {categoryProducts.map((product, index) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <ProductCard product={product} />
            </motion.div>
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {categoryProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductListItem product={product} />
            </motion.div>
          ))}
        </div>
      )}
      
    </motion.div>
  );
}
