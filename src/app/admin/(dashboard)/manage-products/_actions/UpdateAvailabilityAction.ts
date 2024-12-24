"use server"

import { authOptions } from '@/lib/auth';
import prisma  from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
export async function toggleProductAvailability(
    id: string,
    inStock: boolean
  ) {

   const session = await getServerSession(authOptions);

   if (!session || session.user?.role === "VIEW_ONLY") {
    return; 
  }


    await prisma.product.update({
      where: { id },
      data: { inStock },
    });
  
    revalidatePath("/");
    revalidatePath("/manage-products");
  }