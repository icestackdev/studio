"use client";

import { useTelegram } from '@/hooks/useTelegram';
import { useCart } from '@/contexts/CartProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const webApp = useTelegram();
  const { state } = useCart();
  const user = webApp?.initDataUnsafe?.user;
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
          <h1 className="text-xl font-bold">{user ? `${user.first_name} ${user.last_name || ''}` : 'Guest'}</h1>
          <p className="text-muted-foreground">@{user?.username || 'telegram_user'}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">My Pre-orders</h2>
        {reversedOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingBag className="mx-auto h-12 w-12" />
            <p className="mt-4">You have no pre-orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reversedOrders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-base">
                    <span>Order {order.id}</span>
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{format(order.date, 'MMMM d, yyyy')}</p>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.product.name} ({item.size})</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
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
