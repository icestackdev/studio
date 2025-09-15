export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { id: string; hint: string }[];
  sizes: string[];
  category: string;
}

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
}

export interface PreOrder {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  total: number;
  date: Date;
  status: 'Pending' | 'Confirmed' | 'Shipped';
}
