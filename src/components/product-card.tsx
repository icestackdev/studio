
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ImageIcon, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartProvider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const { toast } = useToast();
  const { dispatch } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length > 1) {
        // If there are multiple sizes, we should probably navigate to the product page
        // For now, let's just pick the first size as a default for quick add
        const defaultSize = product.sizes[0];
         dispatch({ type: 'ADD_TO_CART', payload: { product, size: defaultSize, quantity: 1 } });
         toast({
            title: 'Added to cart!',
            description: `${product.name} (${defaultSize}) has been added.`,
        });
    } else {
        const size = product.sizes[0];
        dispatch({ type: 'ADD_TO_CART', payload: { product, size, quantity: 1 } });
        toast({
            title: 'Added to cart!',
            description: `${product.name} has been added to your cart.`,
        });
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/products/${product.id}`} className="space-y-2 block">
        <Card className="w-full overflow-hidden transition-all duration-300 border rounded-2xl shadow-sm bg-card">
          <div className="relative w-full aspect-square bg-muted overflow-hidden rounded-2xl">
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
             <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 rounded-full">
                <Heart className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        <div className="px-1">
            <h3 className="text-sm font-semibold truncate text-foreground">{product.name}</h3>
            <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold text-foreground">${product.price.toFixed(2)}</p>
                <Button size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground" onClick={handleAddToCart}>
                    <ShoppingBag className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}
