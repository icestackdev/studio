'use client';

import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { motion } from 'framer-motion';

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center py-4">
        <h1 className="text-xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm">Find what you're looking for</p>
      </div>
      
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            {categories.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">{category}</TabsTrigger>
            ))}
        </TabsList>
        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {products
                .filter(p => p.category === category)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
