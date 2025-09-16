
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag, ImageIcon } from 'lucide-react';
import { PreorderSheet } from '@/components/PreorderSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const subtotal = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = state.deliveryFee;
  const total = subtotal + deliveryFee;

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
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
        

        {state.cartItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="mx-auto h-16 w-16" />
            <p className="mt-4 text-base">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {state.cartItems.map(item => {
                  const image = item.product.images[0];
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
                            <div className="w-24 h-32 bg-muted rounded-md flex items-center justify-center shrink-0">
                              {image ? (
                                <Image src={image.url} alt={item.product.name} width={96} height={128} className="rounded-md object-cover w-full h-full" data-ai-hint={image.hint} />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h3 className="font-semibold text-base">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                <p className="font-bold text-base mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                <span className="w-5 text-center text-base font-medium">{item.quantity}</span>
                                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => dispatch({type: 'REMOVE_FROM_CART', payload: {cartItemId: item.id}})}><Trash2 className="h-5 w-5" /></Button>
                            </div>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="pt-4 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-base">
                        <span>Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                        <span>Delivery Fee</span>
                        <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
                <div className="pt-2">
                    <Button className="w-full" size="lg" onClick={() => setIsSheetOpen(true)}>
                        Place Pre-order
                    </Button>
                </div>
            </div>
          </div>
        )}
      </motion.div>
      <PreorderSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
