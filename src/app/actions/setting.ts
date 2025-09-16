
'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export async function getSetting(key: string) {
  const setting = await prisma.settings.findUnique({
    where: { key },
  });
  return setting;
}

export async function updateSetting(key: string, value: string) {
  const setting = await prisma.settings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath('/profile');
  return setting;
}
