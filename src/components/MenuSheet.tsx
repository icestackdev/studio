
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartProvider';

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
                {/* Future menu items can go here */}
            </div>
            <div className="text-center text-xs text-muted-foreground">
                <p>Version 1.0.0</p>
                <p>Copyright © pixcelperfect.design</p>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
