import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = PlaceHolderImages.find(img => img.id === product.images[0].id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg">
          <CardHeader className="p-0">
            {primaryImage && (
              <Image
                src={primaryImage.imageUrl}
                alt={product.name}
                width={600}
                height={800}
                className="w-full h-auto object-cover aspect-[3/4]"
                data-ai-hint={primaryImage.imageHint}
              />
            )}
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-base font-semibold truncate">{product.name}</CardTitle>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <p className="text-lg font-bold text-primary-foreground">${product.price.toFixed(2)}</p>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {product.sizes.length} sizes
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
