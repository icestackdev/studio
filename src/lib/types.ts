import { Prisma } from '@prisma/client';

export type ProductImage = {
  id: string;
  url: string;
  productId: string;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { id: string; hint: string }[];
  sizes: string[];
  category: string;
  categoryId: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}

export type CustomerInfo = {
    name: string;
    phone: string;
    address: string;
    notes?: string;
};

export interface PreOrder {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  date: Date;
  status: 'Pending' | 'Confirmed' | 'Shipped';
}
