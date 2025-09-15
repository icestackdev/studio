"use client";

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold tracking-tight">New Arrivals</h1>
        <p className="text-muted-foreground">Check out the latest collection</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.div>
  );
}
