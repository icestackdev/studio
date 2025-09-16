
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: true,
    }
  });
  return products.map(p => ({
    ...p,
    category: p.category.name,
    images: p.images.map(i => ({ id: i.id, url: i.url, hint: p.name.toLowerCase() })),
  }));
}

export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: true,
        }
    });

    if (!product) return null;

    return {
        ...product,
        category: product.category.name,
        images: product.images.map(i => ({ id: i.id, url: i.url, hint: product.name.toLowerCase() })),
    };
}

export async function addProduct(data: any) {
  const { name, description, price, categoryId, sizes, images } = data;
  
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      sizes: sizes.split(',').map((s: string) => s.trim()),
      images: {
        create: images.split(',').map((url: string) => ({ url: url.trim() })),
      },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

export async function updateProduct(id: string, data: any) {
  const { name, description, price, categoryId, sizes, images } = data;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
      sizes: sizes.split(',').map((s: string) => s.trim()),
    },
  });

  if (images) {
    // Delete old images
    await prisma.productImage.deleteMany({ where: { productId: id }});
    // Create new images
    await prisma.productImage.createMany({
        data: images.split(',').map((url: string) => ({ url: url.trim(), productId: id })),
    });
  }

  revalidatePath('/admin/products');
  revalidatePath(`/products/${id}`);
  revalidatePath('/');
  return product;
}

export async function deleteProduct(id: string) {
    // Need to delete order items first
    await prisma.orderItem.deleteMany({ where: { productId: id }});
    await prisma.productImage.deleteMany({ where: { productId: id }});
    const product = await prisma.product.delete({
        where: { id },
    });
    revalidatePath('/admin/products');
    revalidatePath('/');
    return product;
}
