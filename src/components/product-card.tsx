import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

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
      whileHover={{ y: -5 }}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="w-full overflow-hidden transition-shadow hover:shadow-lg bg-card border-transparent">
          <div className="w-full h-auto object-cover aspect-[3/4] rounded-t-lg bg-muted flex items-center justify-center">
            {primaryImage ? (
              <Image
                src={primaryImage.imageUrl}
                alt={product.name}
                width={600}
                height={800}
                className="w-full h-full object-cover"
                data-ai-hint={primaryImage.imageHint}
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          <CardContent className="p-3">
            <h3 className="text-sm font-semibold truncate text-foreground">{product.name}</h3>
            <p className="text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
