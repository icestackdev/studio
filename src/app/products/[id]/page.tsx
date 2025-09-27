
"use client";

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductImages } from '@/components/product-images';
import { ShoppingCart, ArrowLeft, Heart, Share2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const product = state.products.find(p => p.id === params.id);

  if (!product) {
    // This needs to be handled better in a real app, maybe redirect or show a not found component
    // For now, returning null or a simple message. `notFound()` can't be used in client components directly.
    return <div>Product not found</div>;
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

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-24 bg-background"
    >
        <div className="fixed top-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm z-20 max-w-lg mx-auto flex items-center justify-between">
            <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-secondary h-10 w-10"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Details</h1>
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary h-10 w-10">
                <Share2 className="h-5 w-5" />
            </Button>
        </div>

      <div className="relative pt-20">
        <ProductImages product={product} />
        <Button variant="ghost" size="icon" className="absolute top-24 right-4 rounded-full bg-white h-10 w-10 shadow-md">
            <Heart className="h-5 w-5" />
        </Button>
      </div>


      <div className="p-4 mt-2 space-y-4">
        <div>
            <h1 className="text-xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-sm font-medium">{product.category}</p>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold text-base">Select Size</h3>
          <RadioGroup 
            value={selectedSize} 
            onValueChange={setSelectedSize}
            className="flex flex-wrap gap-3"
          >
            {product.sizes.map(size => (
              <div key={size} className="flex items-center">
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={`border-2 rounded-lg w-12 h-12 flex items-center justify-center cursor-pointer transition-colors text-base font-medium ${
                    selectedSize === size 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-secondary border-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-base">Description</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">{product.description}</p>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t max-w-lg mx-auto z-30">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 rounded-full bg-secondary p-1">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => handleQuantityChange(-1)}><Minus className="h-4 w-4" /></Button>
                <span className="w-5 text-center text-base font-bold">{quantity}</span>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => handleQuantityChange(1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-lg font-bold">${(product.price * quantity).toFixed(2)}</p>
            </div>
            <Button size="lg" className="text-base font-bold py-3 rounded-full flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
        </div>
      </div>
    </motion.div>
  );
}
