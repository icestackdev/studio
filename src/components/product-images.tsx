
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import type { Product } from '@/lib/types';
import { ImageIcon } from 'lucide-react';

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const images = product.images;

  if (images.length === 0) {
    return (
        <div className="rounded-lg overflow-hidden">
            <div className="p-0 flex items-center justify-center bg-muted aspect-[3/4]">
                <ImageIcon className="w-24 h-24 text-muted-foreground" />
            </div>
        </div>
    )
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          image && (
            <CarouselItem key={index}>
              <div className="overflow-hidden rounded-b-lg">
                <div className="p-0 flex items-center justify-center">
                  <Image
                    src={image.url}
                    alt={`${product.name} - image ${index + 1}`}
                    width={600}
                    height={800}
                    className="object-cover aspect-[3/4]"
                    priority={index === 0}
                    data-ai-hint={image.hint}
                  />
                </div>
              </div>
            </CarouselItem>
          )
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </>
      )}
    </Carousel>
  );
}
