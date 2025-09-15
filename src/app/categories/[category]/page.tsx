'use client';

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { motion } from 'framer-motion';
import { notFound, useParams } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams();
  const { category: categorySlug } = params;

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
    </motion.div>
  );
}
