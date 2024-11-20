// src/lib/getCategories.ts

import { Category } from "@prisma/client";
import prisma  from "@/lib/prisma"; // Adjust the import path as needed

export async function getCategories(indices: number[] = [2, 3, 5, 7]): Promise<{
  categories: Category[];
  filteredCategories: Category[];
}> {
  try {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany();

    // Filter or select categories based on provided indices
    const filteredCategories =
      categories.length > 0
        ? indices.map((index) => categories[index]).filter(Boolean)
        : [];

    return { categories, filteredCategories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [], filteredCategories: [] };
  }
}
