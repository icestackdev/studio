
'use client';

import { products, categories } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground text-base">
          Find what you're looking for
        </p>
      </div>

      {categories.map((category, index) => {
        const categoryProducts = products.filter(p => p.category === category);
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">{category}</h2>
               <Link href={`/categories/${category.toLowerCase()}`} passHref>
                <Button variant="link" className="text-primary pr-0">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categoryProducts.slice(0, 2).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
