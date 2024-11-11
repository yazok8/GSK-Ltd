// src/app/api/products/deleteProduct/route.ts

import fs from "fs/promises";
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call the deleteProduct function
    const result = await deleteProduct(id);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Product deleted successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while deleting the product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// The deleteProduct function remains the same
async function deleteProduct(id: string) {
  try {
    // Delete the product and get the deleted product data
    const product = await prisma.product.delete({
      where: { id },
    });

    if (!product) return { error: 'Product not found.', status: 404 };

    // Check if the product has images
    if (product.images && Array.isArray(product.images)) {
      // Delete each image from the filesystem
      const deletePromises = product.images.map(async (imagePath) => {
        try {
          const fullPath = `public/${imagePath}`; // Adjust the path as necessary
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

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'An error occurred while deleting the product.', status: 500 };
  }
}
