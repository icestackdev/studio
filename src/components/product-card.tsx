
import Image from 'next/image';
import { Link } from '@/navigation';
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
      whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`}>
        <Card className="w-full overflow-hidden transition-all duration-300">
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
          <CardContent className="p-3 bg-card">
            <h3 className="text-sm font-semibold truncate text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-base font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
