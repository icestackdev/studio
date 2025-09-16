
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ImageIcon, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images && product.images.length > 0
    ? PlaceHolderImages.find(img => img.id === product.images[0].id)
    : null;

  const { dispatch } = useCart();
  const { toast } = useToast();
  const [selectedSize] = useState(product.sizes[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Please select a size on the product page.',
      });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, size: selectedSize, quantity: 1 } });
    toast({
      title: 'Added to cart!',
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

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
                src={primaryImage.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={primaryImage.imageHint}
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
              <Button size="icon" variant="ghost" onClick={handleAddToCart} className="h-8 w-8 rounded-full">
                <ShoppingBag className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
