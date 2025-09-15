'use client';

import { products, categories } from '@/lib/products';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Shirt,
  Snowflake,
  Hand,
  PersonStanding,
  Type,
  Footprints,
} from 'lucide-react';
import Link from 'next/link';

const categoryIcons: { [key: string]: React.ReactNode } = {
  Jackets: <Hand className="h-6 w-6" />,
  Sweaters: <Snowflake className="h-6 w-6" />,
  Pants: <PersonStanding className="h-6 w-6" />,
  Shirts: <Shirt className="h-6 w-6" />,
  Dresses: <Type className="h-6 w-6" />,
  Jeans: <Type className="h-6 w-6" />,
  Shoes: <Footprints className="h-6 w-6" />,
};

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
        <p className="text-muted-foreground text-base">
          Find what you're looking for
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <Link href={`/categories/${category.toLowerCase()}`} key={category}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                      {categoryIcons[category] || <Shirt className="h-6 w-6" />}
                    </div>
                    <span className="font-semibold text-base">{category}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
