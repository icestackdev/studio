
"use client";

import { useState } from 'react';
import { notFound, useRouter } from '@/navigation';
import { useCart } from '@/contexts/CartProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductImages } from '@/components/product-images';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ProductPage({ params }: { params: { id: string } }) {
  const t = useTranslations('ProductPage');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity] = useState(1);
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const product = state.products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        variant: 'destructive',
        title: t('selectSizeError'),
      });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, size: selectedSize, quantity } });
    toast({
      title: t('addedToCartTitle'),
      description: t('addedToCartDesc', { productName: product.name, size: selectedSize }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-24"
    >
      <div className="relative">
        <ProductImages product={product} />
        <Button 
            variant="ghost" 
            className="absolute top-4 left-4 rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm h-auto"
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-1">{t('back')}</span>
        </Button>
      </div>


      <div className="p-4 space-y-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
        </div>

        <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
        
        <p className="text-foreground/80 text-base leading-relaxed">{product.description}</p>
        
        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-base">{t('size')}</h3>
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
                  className={`border rounded-lg px-4 py-2.5 cursor-pointer transition-colors text-base font-medium ${
                    selectedSize === size 
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                    : 'bg-background hover:bg-muted'
                  }`}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t max-w-lg mx-auto z-30">
        <Button size="lg" className="w-full text-base font-bold py-6 rounded-xl" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" /> {t('addToCart')}
        </Button>
      </div>
    </motion.div>
  );
}
