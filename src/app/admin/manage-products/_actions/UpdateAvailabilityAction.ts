"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
export async function toggleProductAvailability(
    id: string,
    inStock: boolean
  ) {
    await prisma.product.update({
      where: { id },
      data: { inStock },
    });
  
    revalidatePath("/");
    revalidatePath("/manage-products");
  }