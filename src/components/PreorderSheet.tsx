
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/contexts/CartProvider';
import { useToast } from '@/hooks/use-toast';
import { useTelegram } from '@/hooks/useTelegram';
import { createOrder } from '@/app/actions/order';
import type { CustomerInfo } from '@/lib/types';
import { Separator } from './ui/separator';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(5, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(10, { message: 'Please enter a full address.' }),
  notes: z.string().optional(),
});

type PreorderFormValues = z.infer<typeof formSchema>;

interface PreorderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreorderSheet({ open, onOpenChange }: PreorderSheetProps) {
  const t = useTranslations('PreorderSheet');
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const webApp = useTelegram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PreorderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  useEffect(() => {
    if(open && webApp?.initDataUnsafe?.user) {
        const user = webApp.initDataUnsafe.user;
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        if(fullName) {
            form.setValue('name', fullName);
        }
    }
  }, [open, webApp, form]);

  const subtotal = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = state.deliveryFee;
  const total = subtotal + deliveryFee;

  const onSubmit = async (data: PreorderFormValues) => {
    setIsSubmitting(true);
    
    const orderItems = state.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size,
        price: item.product.price,
    }));

    try {
        await createOrder({ customer: data as CustomerInfo, items: orderItems, total, deliveryFee });
        
        dispatch({ type: 'CLEAR_CART' });

        toast({
            title: t('preorderPlaced'),
            description: t('preorderPlacedDesc'),
        });
        setIsSubmitting(false);
        onOpenChange(false);

    } catch(error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: t('preorderError'),
            description: t('preorderErrorDesc'),
        });
        setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-lg max-w-lg mx-auto p-4">
        <SheetHeader>
          <SheetTitle className="text-lg">{t('confirmYourPreorder')}</SheetTitle>
          <SheetDescription className="text-sm">
            {t('provideDetails')}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{t('fullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('fullNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{t('phone')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('phonePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{t('address')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('addressPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{t('notes')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('notesPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 space-y-2">
                <Separator />
                <div className="flex justify-between text-base">
                    <span>{t('subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                    <span>{t('deliveryFee')}</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                    <span>{t('total')}</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

             <SheetFooter className="gap-2 sm:justify-end pt-2">
                <Button type="submit" disabled={isSubmitting} size="lg" className='w-full'>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('confirmButton', { total: total.toFixed(2) })}
                </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
