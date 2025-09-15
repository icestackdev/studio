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
import { ChevronDown } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold tracking-tight">Shop by Category</h1>
        <p className="text-muted-foreground text-base">Find what you're looking for</p>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-2">
        {categories.map((category, index) => (
          <AccordionItem value={`item-${index}`} key={category} className="border-b-0">
             <AccordionTrigger className="flex justify-between items-center w-full px-4 py-3 text-base font-semibold text-left bg-card border rounded-lg hover:bg-muted/80 transition-colors [&[data-state=open]>svg]:rotate-180">
                <span>{category}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
            </AccordionTrigger>
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
