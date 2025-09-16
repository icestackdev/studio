
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import type { PreOrder } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, DollarSign, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOrders, updateOrderStatus } from '@/app/actions/order';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@prisma/client';

type PreOrderStatus = Order['status'];

export default function ManageOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const fetchedOrders = await getOrders();
    setOrders(fetchedOrders as PreOrder[]);
  };

  const handleStatusChange = async (orderId: string, status: PreOrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: 'Order Status Updated',
        description: `Order ${orderId} has been updated to ${status}.`
      });
      fetchOrders();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error updating order status',
      });
    }
  };
  
  const reversedOrders = [...orders].reverse();

  const summaryStats = useMemo(() => {
    const now = new Date();
    
    const weeklyStart = startOfWeek(now);
    const weeklyEnd = endOfWeek(now);
    const monthlyStart = startOfMonth(now);
    const monthlyEnd = endOfMonth(now);

    const weeklyOrders = orders.filter(o => isWithinInterval(new Date(o.date), { start: weeklyStart, end: weeklyEnd }));
    const monthlyOrders = orders.filter(o => isWithinInterval(new Date(o.date), { start: monthlyStart, end: monthlyEnd }));

    const weeklyRevenue = weeklyOrders.reduce((acc, order) => acc + order.total, 0);
    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.total, 0);

    return {
      weekly: {
        revenue: weeklyRevenue,
        orders: weeklyOrders.length,
      },
      monthly: {
        revenue: monthlyRevenue,
        orders: monthlyOrders.length,
      }
    };
  }, [orders]);

  const activeSummary = summaryStats[period];
  const periodLabel = period === 'weekly' ? 'This Week' : 'This Month';
  const revenueLabel = period === 'weekly' ? 'Weekly Revenue' : 'Monthly Revenue';
  const ordersLabel = period === 'weekly' ? 'Weekly Orders' : 'Monthly Orders';

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
        <h1 className="text-lg font-bold">Manage Orders</h1>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">{periodLabel}</h2>
           <Select onValueChange={(value: 'weekly' | 'monthly') => setPeriod(value)} defaultValue={period}>
            <SelectTrigger className="w-[140px] text-xs">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly" className="text-xs">This Week</SelectItem>
              <SelectItem value="monthly" className="text-xs">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{revenueLabel}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${activeSummary.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{ordersLabel}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSummary.orders}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-base font-semibold">All Orders</h2>
        {reversedOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-sm">
                <span>Order #{order.id.substring(0, 8)}</span>
                <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>{order.status}</Badge>
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                <p>{format(new Date(order.date), 'MMMM d, yyyy, h:mm a')}</p>
                <p>{order.customer.name}</p>
              </div>
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
               <div className="mt-4">
                <p className="text-xs font-medium mb-2">Update Status</p>
                <Select onValueChange={(value: PreOrderStatus) => handleStatusChange(order.id, value)} defaultValue={order.status}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="Confirmed" className="text-xs">Confirmed</SelectItem>
                    <SelectItem value="Shipped" className="text-xs">Shipped</SelectItem>
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
