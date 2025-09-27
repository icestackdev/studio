
"use client";

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import type { Product } from '@/lib/types';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const images = product.images;
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
        <div className="rounded-lg overflow-hidden">
            <div className="p-0 flex items-center justify-center bg-muted aspect-square">
                <ImageIcon className="w-24 h-24 text-muted-foreground" />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-3">
        <Carousel className="w-full" onOptionChange={(api) => setActiveIndex((api as any).selectedScrollSnap())}>
            <CarouselContent>
                {images.map((image, index) => (
                image && (
                    <CarouselItem key={index}>
                    <div className="overflow-hidden rounded-2xl bg-secondary">
                        <div className="p-0 flex items-center justify-center">
                        <Image
                            src={image.url}
                            alt={`${product.name} - image ${index + 1}`}
                            width={600}
                            height={600}
                            className="object-contain aspect-square"
                            priority={index === 0}
                            data-ai-hint={image.hint}
                        />
                        </div>
                    </div>
                    </CarouselItem>
                )
                ))}
            </CarouselContent>
        </Carousel>
        {images.length > 1 && (
            <div className="flex justify-center gap-2">
                {images.map((image, index) => (
                    <button key={index} className="w-16 h-16 rounded-lg overflow-hidden border-2 p-0.5" >
                        <div className={cn("w-full h-full rounded-md bg-cover bg-center", activeIndex === index ? 'border-2 border-primary rounded-md' : '')} style={{backgroundImage: `url(${image.url})`}}/>
                    </button>
                ))}
            </div>
      )}
    </div>
  );
}
