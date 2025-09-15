"use client";

import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/products';
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
      className="space-y-8"
    >
      <div className="relative rounded-lg overflow-hidden h-80 w-full">
        {heroImage && (
             <Image 
                src={heroImage.imageUrl} 
                alt="Hero Image" 
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
             />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-end p-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Summer Collection</h1>
            <p className="text-lg text-white/90 mt-2">Fresh looks for the new season.</p>
            <Link href="/categories">
                <Button className="mt-4" variant="secondary">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured Products</h2>
          <Link href="/categories" className="text-sm font-medium text-accent hover:underline">
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
