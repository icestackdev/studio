'use client';

import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Find what you're looking for</p>
      </div>
      
      <Accordion type="single" collapsible defaultValue={categories[0]} className="w-full">
        {categories.map(category => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {products
                  .filter(p => p.category === category)
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
