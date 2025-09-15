"use client";

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="relative rounded-xl overflow-hidden h-96 w-full">
        {heroImage && (
             <Image 
                src={heroImage.imageUrl} 
                alt="Hero Image" 
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
             />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-start justify-end p-6">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg"
            >
              New Season Arrivals
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-white/90 mt-2 max-w-md drop-shadow-md"
            >
              Discover the latest trends and refresh your wardrobe.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/categories">
                  <Button className="mt-4" size="lg" variant="secondary">
                      Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </Link>
            </motion.div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
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
