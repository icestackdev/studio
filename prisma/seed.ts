
import { PrismaClient } from '@prisma/client';
import placeholderData from '../src/lib/placeholder-images.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  await prisma.settings.upsert({
    where: { key: 'shopName' },
    update: {},
    create: {
      key: 'shopName',
      value: 'ThreadLine',
    },
  });
  console.log('Created default shop name setting');

  const categoriesData = [
    { name: 'Jackets' },
    { name: 'Sweaters' },
    { name: 'Trousers' },
    { name: 'Shirts' },
    { name: 'Dresses' },
    { name: 'Jeans' },
    { name: 'Boots' },
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
    console.log(`Created category with id: ${category.id}`);
  }

  const getCategory = (name: string) => createdCategories.find(c => c.name === name);

  const productsData = [
    {
      name: 'Leather Jacket',
      description: 'A timeless black leather jacket, perfect for any occasion.',
      price: 149.99,
      category: getCategory('Jackets'),
      sizes: ['S', 'M', 'L', 'XL'],
      imageIds: ['product-1-1', 'product-1-2', 'product-1-3'],
    },
    {
      name: 'Wool Sweater',
      description: 'A cozy cream-colored wool sweater to keep you warm.',
      price: 89.99,
      category: getCategory('Sweaters'),
      sizes: ['S', 'M', 'L'],
      imageIds: ['product-2-1', 'product-2-2', 'product-2-3'],
    },
    {
      name: 'Denim Jacket',
      description: 'A classic blue denim jacket for a stylish, casual look.',
      price: 119.99,
      category: getCategory('Jackets'),
      sizes: ['M', 'L', 'XL'],
      imageIds: ['product-3-1', 'product-3-2'],
    },
    {
      name: 'Linen Trousers',
      description: 'Light and airy beige linen trousers for a comfortable day out.',
      price: 79.99,
      category: getCategory('Trousers'),
      sizes: ['S', 'M', 'L'],
      imageIds: ['product-4-1', 'product-4-2'],
    },
    {
        name: 'Crewneck Sweatshirt',
        description: 'A comfortable and stylish heather grey crewneck sweatshirt.',
        price: 69.99,
        category: getCategory('Sweaters'),
        sizes: ['S', 'M', 'L', 'XL'],
        imageIds: ['product-5-1', 'product-5-2']
    },
    {
        name: 'Button-Down Shirt',
        description: 'A crisp white button-down shirt, a wardrobe essential.',
        price: 59.99,
        category: getCategory('Shirts'),
        sizes: ['S', 'M', 'L', 'XL'],
        imageIds: ['product-6-1', 'product-6-2']
    },
    {
        name: 'Floral Sundress',
        description: 'A beautiful floral sundress, perfect for sunny days.',
        price: 99.99,
        category: getCategory('Dresses'),
        sizes: ['S', 'M', 'L'],
        imageIds: ['product-7-1', 'product-7-2']
    },
    {
        name: 'High-Waisted Jeans',
        description: 'Classic high-waisted blue jeans for a flattering fit.',
        price: 89.99,
        category: getCategory('Jeans'),
        sizes: ['26', '28', '30', '32'],
        imageIds: ['product-8-1', 'product-8-2']
    },
    {
        name: 'Leather Boots',
        description: 'Stylish and durable brown leather boots.',
        price: 129.99,
        category: getCategory('Boots'),
        sizes: ['7', '8', '9', '10', '11'],
        imageIds: ['product-9-1', 'product-9-2']
    }
  ];

  for (const p of productsData) {
    if (!p.category) continue;
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        categoryId: p.category.id,
        sizes: p.sizes,
        images: {
          create: p.imageIds
            .map(id => placeholderData.placeholderImages.find(img => img.id === id))
            .filter(img => !!img)
            .map(img => ({ url: img!.imageUrl })),
        },
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
