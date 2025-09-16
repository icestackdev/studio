
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`} className="space-y-2 block">
        <Card className="w-full overflow-hidden transition-all duration-300 border-0 shadow-none bg-muted rounded-lg">
          <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={primaryImage.hint}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </Card>
        <div>
            <h3 className="text-sm font-semibold truncate text-foreground">{product.name}</h3>
            <p className="text-sm font-bold text-primary">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
