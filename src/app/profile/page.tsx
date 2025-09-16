
"use client";

import { useTelegram } from '@/hooks/useTelegram';
import { useCart } from '@/contexts/CartProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingBag, Settings, ListOrdered, Package, Save, Folder, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getOrders } from '@/app/actions/order';
import type { Order, OrderItem, Product as PrismaProduct, Category } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

type OrderWithItems = Order & { items: (OrderItem & { product: PrismaProduct })[] };

export default function ProfilePage() {
  const webApp = useTelegram();
  const { state, updateShopName, updateDeliveryFee } = useCart();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shopName, setShopName] = useState(state.shopName);
  const [deliveryFee, setDeliveryFee] = useState(state.deliveryFee.toString());
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);


  useEffect(() => {
    setIsAdmin(true); // All users are admins as requested
    if (webApp?.initDataUnsafe?.user) {
      setUser(webApp.initDataUnsafe.user);
    } else {
      // Fallback for when not in Telegram
      const mockUser = { first_name: 'Guest', last_name: 'User', username: 'guest_user' };
      setUser(mockUser);
    }
  }, [webApp]);

  useEffect(() => {
    // This is a simple mock of fetching orders for the current user.
    // In a real app, you would filter orders by user ID.
    const fetchMyOrders = async () => {
      setIsLoadingOrders(true);
      const allOrders = await getOrders();
      setMyOrders(allOrders);
      setIsLoadingOrders(false);
    };
    fetchMyOrders();
  }, []);

  const handleSaveShopName = async () => {
    try {
      await updateShopName(shopName);
      toast({
        title: 'Shop Name Updated',
        description: `The shop name has been changed to "${shopName}".`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating shop name.'
      })
    }
  };

  const handleSaveDeliveryFee = async () => {
    const fee = parseFloat(deliveryFee);
    if (isNaN(fee) || fee < 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid amount.',
        description: 'Please enter a valid, non-negative number for the delivery fee.'
      });
      return;
    }

    try {
      await updateDeliveryFee(fee);
      toast({
        title: 'Delivery Fee Updated',
        description: `The delivery fee has been set to $${fee.toFixed(2)}.`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating delivery fee.'
      })
    }
  };

  const reversedOrders = [...myOrders].reverse();

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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName" className="text-sm">Shop Name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="text-sm"
                />
                <Button size="icon" onClick={handleSaveShopName}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryFee" className="text-sm">Delivery Fee</Label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    className="pl-6 text-sm"
                  />
                </div>
                <Button size="icon" onClick={handleSaveDeliveryFee}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin/products" passHref>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/categories" passHref>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <Folder className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/admin/orders" passHref>
                <Button variant="outline" className="w-full justify-start text-sm col-span-2">
                  <ListOrdered className="mr-2 h-4 w-4" />
                  Manage Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="text-base font-semibold mb-4">My Pre-orders</h2>
        {isLoadingOrders ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : reversedOrders.length === 0 ? (
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
                    <span>Order #{order.id.substring(0, 8)}</span>
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{format(new Date(order.date), 'MMMM d, yyyy')}</p>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs space-y-1">
                    {order.items.map((item: any) => (
                      <li key={item.id} className="flex justify-between">
                        <span>{item.quantity}x {item.product.name} ({item.size})</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      ${order.items
                        .reduce((acc: number, item: any) => acc + (item.price ?? 0) * (item.quantity ?? 0), 0)
                        .toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${(order.deliveryFee ?? 0).toFixed(2)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>${(order.total ?? 0).toFixed(2)}</span>
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
