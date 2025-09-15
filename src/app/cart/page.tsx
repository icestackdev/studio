"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { PreorderSheet } from '@/components/PreorderSheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const total = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
        </div>

        {state.cartItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="mx-auto h-12 w-12" />
            <p className="mt-4">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {state.cartItems.map(item => {
                  const image = PlaceHolderImages.find(img => img.id === item.product.images[0].id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    >
                        <Card className="overflow-hidden">
                        <CardContent className="p-4 flex gap-4">
                            {image && <Image src={image.imageUrl} alt={item.product.name} width={80} height={100} className="rounded-md object-cover" data-ai-hint={image.imageHint} />}
                            <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                <p className="font-bold text-sm mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                <span className="w-4 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => dispatch({type: 'REMOVE_FROM_CART', payload: {cartItemId: item.id}})}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="pt-4 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={() => setIsSheetOpen(true)}>
                Place Pre-order
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <PreorderSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
