
"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import type { PreOrder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManageOrdersPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<PreOrder[]>(state.preOrders);

  const handleStatusChange = (orderId: string, status: PreOrder['status']) => {
    // In a real app, you would dispatch an action to update the order status.
    // For now, we'll just update the local state to simulate this.
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    // Example of a dispatch call you might make:
    // dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };
  
  const reversedOrders = [...orders].reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <Button 
            variant="ghost" 
            className="rounded-full bg-background/60 hover:bg-background/80 backdrop-blur-sm h-auto"
            onClick={() => router.back()}
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="ml-1">Back</span>
        </Button>
        <h1 className="text-xl font-bold">Manage Orders</h1>
      </div>

      <div className="space-y-4">
        {reversedOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-base">
                <span>Order {order.id}</span>
                <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                <p>{format(order.date, 'MMMM d, yyyy, h:mm a')}</p>
                <p>{order.customer.name}</p>
              </div>
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
               <div className="mt-4">
                <p className="text-sm font-medium mb-2">Update Status</p>
                <Select onValueChange={(value: PreOrder['status']) => handleStatusChange(order.id, value)} defaultValue={order.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

