
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import type { CustomerInfo } from "@/lib/types";
import type { Order, OrderItem } from "@prisma/client";

type OrderItemInput = {
    productId: string;
    quantity: number;
    size: string;
    price: number;
}

export async function createOrder({ customer, items, total }: { customer: CustomerInfo, items: OrderItemInput[], total: number }) {
  const order = await prisma.order.create({
    data: {
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      customerNotes: customer.notes,
      total,
      status: 'Pending',
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
      },
    },
  });
  revalidatePath('/profile');
  revalidatePath('/admin/orders');
  return order;
}

export async function getOrders() {
    const orders = await prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            category: true,
                            images: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return orders.map(order => ({
        ...order,
        date: order.createdAt,
        customer: {
            name: order.customerName,
            phone: order.customerPhone,
            address: order.customerAddress,
            notes: order.customerNotes
        },
        items: order.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            size: item.size,
            product: {
                ...item.product,
                category: item.product.category.name,
                images: item.product.images.map(i => ({ id: i.id, url: i.url, hint: item.product.name.toLowerCase() })),
            }
        }))
    }));
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
    revalidatePath('/admin/orders');
    revalidatePath('/profile');
    return order;
}
