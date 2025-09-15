"use client";

import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold tracking-tight">New Arrivals</h1>
        <p className="text-muted-foreground">Check out the latest collection</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 gap-4">
              {products
                .filter((p) => p.category === category)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}
