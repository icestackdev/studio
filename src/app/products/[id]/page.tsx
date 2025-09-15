"use client";

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductImages } from '@/components/product-images';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity] = useState(1);
  const { dispatch } = useCart();
  const { toast } = useToast();

  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        variant: 'destructive',
        title: 'Please select a size.',
      });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, size: selectedSize, quantity } });
    toast({
      title: 'Added to cart!',
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-24"
    >
      <ProductImages product={product} />

      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-2xl font-bold text-primary-foreground">${product.price.toFixed(2)}</p>
        <p className="text-muted-foreground">{product.description}</p>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Size</h3>
          <RadioGroup 
            value={selectedSize} 
            onValueChange={setSelectedSize}
            className="flex flex-wrap gap-2"
          >
            {product.sizes.map(size => (
              <div key={size} className="flex items-center">
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={`border rounded-md px-4 py-2 cursor-pointer transition-colors ${
                    selectedSize === size 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-accent/50'
                  }`}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t max-w-lg mx-auto z-30">
        <Button size="lg" className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
