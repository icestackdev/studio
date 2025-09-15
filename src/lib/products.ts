import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Tee',
    description: 'A timeless classic. Made from 100% premium cotton for ultimate comfort and a perfect fit. Ideal for everyday wear.',
    price: 29.99,
    images: [
      { id: 'product-1-1', hint: 'white t-shirt' },
      { id: 'product-1-2', hint: 't-shirt model' },
      { id: 'product-1-3', hint: 'fabric detail' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-Shirts',
  },
  {
    id: '2',
    name: 'Urban Hoodie',
    description: 'Stay warm and stylish with our Urban Hoodie. Features a soft fleece interior and a modern, relaxed fit.',
    price: 79.99,
    images: [
      { id: 'product-2-1', hint: 'black hoodie' },
      { id: 'product-2-2', hint: 'hoodie model' },
      { id: 'product-2-3', hint: 'hoodie back' },
    ],
    sizes: ['S', 'M', 'L'],
    category: 'Hoodies',
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
    name: 'Slim-Fit Chinos',
    description: 'Elegant and comfortable, these slim-fit chinos are perfect for both casual and semi-formal occasions.',
    price: 69.99,
    images: [
      { id: 'product-4-1', hint: 'khaki pants' },
      { id: 'product-4-2', hint: 'pants model' },
    ],
    sizes: ['30', '32', '34', '36'],
    category: 'Pants',
  },
  {
    id: '5',
    name: 'Graphic Sweatshirt',
    description: 'Make a statement with our new graphic sweatshirt, featuring a unique design by a local artist. Limited edition.',
    price: 89.99,
    images: [
      { id: 'product-5-1', hint: 'graphic sweatshirt' },
      { id: 'product-5-2', hint: 'sweatshirt design' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Hoodies',
  },
  {
    id: '6',
    name: 'Striped Long-Sleeve',
    description: 'A comfortable and stylish long-sleeve shirt with a classic striped pattern. Great for layering.',
    price: 45.00,
    images: [
      { id: 'product-6-1', hint: 'striped shirt' },
      { id: 'product-6-2', hint: 'shirt detail' },
    ],
    sizes: ['S', 'M', 'L'],
    category: 'T-Shirts',
  },
];

export const categories = [...new Set(products.map((p) => p.category))];
