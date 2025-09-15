"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Product } from '@/lib/types';

interface ProductImagesProps {
  product: Product;
}

export function ProductImages({ product }: ProductImagesProps) {
  const images = product.images.map(img => PlaceHolderImages.find(pImg => pImg.id === img.id)).filter(Boolean);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          image && (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="p-0 flex items-center justify-center">
                  <Image
                    src={image.imageUrl}
                    alt={`${product.name} - image ${index + 1}`}
                    width={600}
                    height={800}
                    className="object-cover aspect-[3/4]"
                    priority={index === 0}
                    data-ai-hint={image.imageHint}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          )
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  );
}
