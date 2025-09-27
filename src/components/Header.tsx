
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Bell, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartProvider';
import Link from 'next/link';

export function Header() {
  const webApp = useTelegram();
  const [user, setUser] = useState<any>(null);
  const { state } = useCart();
  const cartItemCount = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);


  useEffect(() => {
    if (webApp?.initDataUnsafe?.user) {
      setUser(webApp.initDataUnsafe.user);
    } else {
      // Fallback for when not in Telegram
      const mockUser = { first_name: 'Alex', username: 'alex' };
      setUser(mockUser);
    }
  }, [webApp]);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-40 max-w-lg mx-auto bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://t.me/i/userpic/320/${user?.username}.jpg`} />
                    <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm text-muted-foreground">Hello {user?.first_name || 'Guest'}</p>
                    <p className="font-bold text-base">Good Morning!</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                </Button>
                <Link href="/cart">
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                        <ShoppingBag className="h-5 w-5" />
                         {cartItemCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                            </span>
                        )}
                    </Button>
                </Link>
            </div>
        </div>
    </header>
  );
}
