import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Leather Jacket',
    description: 'A timeless classic. Made from 100% premium leather for a sleek look and comfortable fit. Perfect for any occasion.',
    price: 249.99,
    images: [
      { id: 'product-1-1', hint: 'leather jacket' },
      { id: 'product-1-2', hint: 'jacket model' },
      { id: 'product-1-3', hint: 'jacket detail' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Jackets',
  },
  {
    id: '2',
    name: 'Wool Sweater',
    description: 'Stay warm and stylish with our Wool Sweater. Features a soft wool blend and a modern, relaxed fit.',
    price: 89.99,
    images: [
      { id: 'product-2-1', hint: 'wool sweater' },
      { id: 'product-2-2', hint: 'sweater model' },
      { id: 'product-2-3', hint: 'sweater back' },
    ],
    sizes: ['S', 'M', 'L'],
    category: 'Sweaters',
  },
  {
    id: '3',
    name: 'Denim Jacket',
    description: 'A versatile wardrobe staple. Our Denim Jacket is crafted from durable denim with a slightly worn-in look.',
    price: 129.99,
    images: [
      { id: 'product-3-1', hint: 'denim jacket' },
      { id: 'product-3-2', hint: 'jacket model' },
    ],
    sizes: ['M', 'L', 'XL'],
    category: 'Jackets',
  },
  {
    id: '4',
    name: 'Linen Trousers',
    description: 'Elegant and comfortable, these linen trousers are perfect for both casual and semi-formal occasions.',
    price: 79.99,
    images: [
      { id: 'product-4-1', hint: 'linen trousers' },
      { id: 'product-4-2', hint: 'trousers model' },
    ],
    sizes: ['30', '32', '34', '36'],
    category: 'Pants',
  },
  {
    id: '5',
    name: 'Crewneck Sweatshirt',
    description: 'A comfortable and classic crewneck sweatshirt. A must-have for a relaxed and stylish look.',
    price: 69.99,
    images: [
      { id: 'product-5-1', hint: 'crewneck sweatshirt' },
      { id: 'product-5-2', hint: 'sweatshirt fabric' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Sweaters',
  },
  {
    id: '6',
    name: 'Button-Down Shirt',
    description: 'A comfortable and stylish long-sleeve shirt with a classic look. Great for layering or wearing on its own.',
    price: 55.00,
    images: [
      { id: 'product-6-1', hint: 'button-down shirt' },
      { id: 'product-6-2', hint: 'shirt detail' },
    ],
    sizes: ['S', 'M', 'L'],
    category: 'Shirts',
  },
];

export const categories = [...new Set(products.map((p) => p.category))];
