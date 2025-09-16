
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/services/cloudinary";

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

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const sizes = (formData.get('sizes') as string).split(',').map((s: string) => s.trim());
  const images = formData.getAll('images') as File[];

  const imageUrls = await Promise.all(
    images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await uploadImage(buffer);
        return result.secure_url;
    })
  );
  
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      categoryId,
      sizes,
      images: {
        create: imageUrls.map((url: string) => ({ url })),
      },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  return product;
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;
    const sizes = (formData.get('sizes') as string).split(',').map((s: string) => s.trim());
    const images = formData.getAll('images') as File[];
    const existingImageUrls = formData.get('existingImages') as string;

    let imageUrls = existingImageUrls ? existingImageUrls.split(',') : [];

    if (images && images.length > 0 && images[0].size > 0) {
        const newImageUrls = await Promise.all(
            images.map(async (image) => {
                const buffer = Buffer.from(await image.arrayBuffer());
                const result = await uploadImage(buffer);
                return result.secure_url;
            })
        );
        imageUrls = [...imageUrls, ...newImageUrls];
    }


  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      categoryId,
      sizes,
    },
  });

  if (imageUrls) {
    // Delete old images
    await prisma.productImage.deleteMany({ where: { productId: id }});
    // Create new images
    await prisma.productImage.createMany({
        data: imageUrls.map((url: string) => ({ url: url.trim(), productId: id })),
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
