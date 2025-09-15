
"use client";

import { useTelegram } from '@/hooks/useTelegram';
import { useCart } from '@/contexts/CartProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag, Settings, ListOrdered, Package } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Simple mock for admin check
const ADMIN_USERNAMES = ['tg_username_1', 'your_username', 'telegram_user'];

export default function ProfilePage() {
  const webApp = useTelegram();
  const { state } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (webApp?.initDataUnsafe?.user) {
      const telegramUser = webApp.initDataUnsafe.user;
      setUser(telegramUser);
      setIsAdmin(ADMIN_USERNAMES.includes(telegramUser.username || ''));
    } else {
        // For local testing when not in Telegram
        const mockUser = { first_name: 'Admin', last_name: 'User', username: 'your_username' };
        setUser(mockUser);
        setIsAdmin(ADMIN_USERNAMES.includes(mockUser.username));
    }
  }, [webApp]);

  const reversedOrders = [...state.preOrders].reverse();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center space-y-2 py-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`https://t.me/i/userpic/320/${user?.username}.jpg`} />
          <AvatarFallback>
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-lg font-bold">{user ? `${user.first_name} ${user.last_name || ''}` : 'Guest'}</h1>
          <p className="text-muted-foreground text-sm">@{user?.username || 'your_username'}</p>
        </div>
      </div>

       {isAdmin && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-base">
                    <Settings className="mr-2 h-5 w-5" />
                    Admin Panel
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                 <Link href="/admin/products" passHref>
                    <Button variant="outline" className="w-full justify-start text-sm">
                        <Package className="mr-2 h-4 w-4" />
                        Manage Products
                    </Button>
                </Link>
                 <Link href="/admin/orders" passHref>
                    <Button variant="outline" className="w-full justify-start text-sm">
                        <ListOrdered className="mr-2 h-4 w-4" />
                        Manage Orders
                    </Button>
                </Link>
            </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-base font-semibold mb-4">My Pre-orders</h2>
        {reversedOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="mx-auto h-12 w-12" />
            <p className="mt-4 text-sm">You have no pre-orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reversedOrders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-sm">
                    <span>Order {order.id}</span>
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{format(order.date, 'MMMM d, yyyy')}</p>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs space-y-1">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.product.name} ({item.size})</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
