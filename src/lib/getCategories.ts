// src/lib/getCategories.ts

import { Category, Product } from "@prisma/client";
import prisma  from "@/lib/prisma"; 

export async function getAllCategories(): Promise<Category[]> {
  try {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Adjust the import based on your setup



export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  try {
    const products: Product[] = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    return [];
  }
}
