
"use client";

import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const promoImage = PlaceHolderImages.find(img => img.id === 'promo-banner-1');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:w-1/2 space-y-4">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold tracking-tight text-foreground"
                >
                  Summer Collection is Here
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-base text-muted-foreground"
                >
                  Light, airy, and ready for sunshine. Discover our new arrivals.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Link href="/categories">
                      <Button className="mt-4" size="lg">
                          Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                  </Link>
                </motion.div>
            </div>
             <div className="md:w-1/2 h-64 md:h-auto">
                {promoImage && (
                    <Image
                        src={promoImage.imageUrl}
                        alt="Summer Collection"
                        width={600}
                        height={400}
                        className="object-cover h-full w-full"
                        data-ai-hint={promoImage.imageHint}
                        priority
                    />
                )}
            </div>
        </div>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
             <Link href="/categories" key={category}>
                <Card className="group relative overflow-hidden rounded-lg transition-shadow hover:shadow-lg">
                    <div className="h-24 bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground transition-transform group-hover:scale-110"/>
                    </div>
                    <div className="p-3">
                        <h3 className="font-semibold text-sm text-center">{category}</h3>
                    </div>
                </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
          <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
