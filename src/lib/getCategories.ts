// src/lib/getCategories.ts

import { Category } from "@prisma/client";
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
