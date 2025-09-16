
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductListItemProps {
  product: Product;
}

export function ProductListItem({ product }: ProductListItemProps) {
  const primaryImage = product.images && product.images.length > 0
    ? product.images[0]
    : null;

  return (
    <motion.div
      whileHover={{ transform: 'translateX(2px)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
      transition={{ duration: 0.2 }}
      className="rounded-lg"
    >
      <Link href={`/products/${product.id}`}>
        <Card className="w-full overflow-hidden transition-all duration-300">
          <CardContent className="p-3 flex items-center gap-4">
             <div className="relative w-24 h-24 bg-muted overflow-hidden rounded-md shrink-0">
                {primaryImage ? (
                <Image
                    src={primaryImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={primaryImage.hint}
                />
                ) : (
                <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                )}
            </div>
            <div className="flex-1">
                <h3 className="text-base font-semibold truncate text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-lg font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
