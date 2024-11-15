//src/app/(customerFacing)/actions/categories.ts

import { cache } from "@/lib/cache";
import { CategoryWithImage, ProductWithCategory } from "@/types/Category";
import prisma  from '@/lib/prisma';
import { Category } from "@prisma/client";


/**
 * Fetches all categories with their images.
 * Ensures that each category has an image by providing a default if necessary.
 */
export const getAllCategoriesWithImages = cache(
    async (): Promise<CategoryWithImage[]> => {
      const categories = await prisma.category.findMany({
        where: {
          products: {
            some: {
              inStock: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          image: true, // Ensure only the image field is selected
        },
      });
  
      // Map categories to ensure 'image' is always a string starting with '/'
      return categories.map(category => ({
        ...category,
        image: category.image ? `/${category.image}` : '/default-category.png', // Prepend '/' to relative paths
      }));
    },
    ["/", "getAllCategoriesWithImages"],
    { revalidate: 60 * 60 * 24 } // Cache for 24 hours
  );

export async function getAllCategoriesWithProducts(): Promise<Category[]> {
    return cache(
      (): Promise<Category[]> => {
        return prisma.category.findMany({
          where: {
            products: {
              some: {
                inStock: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        });
      },
      ["/", "getAllCategoriesWithProducts"],
      { revalidate: 60 * 60 * 24 } // Cache for 24 hours
    )();
  }