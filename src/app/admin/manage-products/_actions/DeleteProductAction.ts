// src/app/api/products/deleteProduct/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs  from 'fs/promises';

/**
 * API Route to delete a product and its associated images.
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { errors: { general: ['Product ID is required.'] } },
        { status: 400 }
      );
    }

    // Delete the product and retrieve the deleted product data
    const product = await prisma.product.delete({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { errors: { general: ['Product not found.'] } },
        { status: 404 }
      );
    }

    // Check if the product has images
    if (product.images && Array.isArray(product.images)) {
      // Delete each image from the filesystem
      const deletePromises = product.images.map(async (imagePath) => {
        try {
          const fullPath = `public/${imagePath}`; // Adjust based on your storage structure
          await fs.unlink(fullPath);
          console.log(`Deleted image: ${fullPath}`);
        } catch (error) {
          console.error(`Failed to delete image ${imagePath}:`, error);
        }
      });

      // Await all deletions
      await Promise.all(deletePromises);
    }

    // Revalidate paths to update cached pages
    revalidatePath("/");
    revalidatePath("/manage-products");

    return NextResponse.json(
      { message: 'Product deleted successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { errors: { general: ['An error occurred while deleting the product.'] } },
      { status: 500 }
    );
  }
}
