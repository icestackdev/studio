
'use client';

import { ProductCard } from '@/components/product-card';
import { ProductListItem } from '@/components/product-list-item';
import { useCart } from '@/contexts/CartProvider';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useCart();
  const { products, categories } = state;
  const { category: categorySlug } = params;
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof categorySlug === 'string') {
        const decodedSlug = decodeURIComponent(categorySlug.replace('-', ' '));
        const foundCategory = categories.find(c => c.toLowerCase() === decodedSlug.toLowerCase());
        setCategoryName(foundCategory || null);
    }
  }, [categorySlug, categories]);

  const categoryProducts = useMemo(
    () => {
        if (!categoryName) return [];
        return products.filter(
            (p) => p.category.toLowerCase() === categoryName.toLowerCase()
        )
    },
    [categoryName, products]
  );
  
  // This handles the case where the slug is invalid or products are not loaded yet
  if (categoryName === null && !products.length) {
    // Maybe show a loading indicator or a not found message
    // returning null for now
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
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
        <div className="flex justify-end gap-1">
            <Button variant={layout === 'grid' ? 'secondary' : 'ghost'} size="icon" className="w-9 h-9" onClick={() => setLayout('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={layout === 'list' ? 'secondary' : 'ghost'} size="icon" className="w-9 h-9" onClick={() => setLayout('list')}>
                <List className="h-5 w-5" />
            </Button>
        </div>
      </div>
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
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
