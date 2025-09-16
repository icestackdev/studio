"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Separator } from './ui/separator';

interface MenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuSheet({ open, onOpenChange }: MenuSheetProps) {
  const { state } = useCart();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px]">
        <SheetHeader>
          <SheetTitle className="text-lg">{state.shopName}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full py-4">
            <div className="flex-1">
                <LanguageSwitcher />
            </div>
             <Separator className="my-4" />
            <div className="text-center text-xs text-muted-foreground">
                <p>Version 1.0.0</p>
                <p>Copyright © pixcelperfect.design</p>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
