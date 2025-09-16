
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function addCategory(name: string) {
  const category = await prisma.category.create({
    data: { name },
  });
  revalidatePath('/admin/categories');
  return category;
}

export async function updateCategory(id: string, name: string) {
  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return category;
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({
    where: { id },
  });
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return category;
}
