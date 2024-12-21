import { cache } from "@/lib/cache";
import { CategoryWithImage, ProductWithCategory } from "@/types/Category";
import prisma  from '@/lib/prisma';
import { Category as PrismaCategory } from "@prisma/client";


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

export async function getAllCategoriesWithProducts(): Promise<PrismaCategory[]> {
    return cache(
      (): Promise<PrismaCategory[]> => {
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

    // Fetch paginated products by category
    export async function getProductsByCategoryPaginated(id: string, page: number, perPage: number) {
      try {
        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where: { categoryId: id },
            skip: (page - 1) * perPage,
            take: perPage,
          }),
          prisma.product.count({
            where: { categoryId: id },
          }),
        ]);
    
        return { products, total };
      } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], total: 0 };
      }
    }

  // Fetch a single category by ID
  export async function getCategoryById(id: string) {
    try {
      // If using MongoDB with Prisma
      return await prisma.category.findUnique({
        where: { id },
        include: { products: true }, // Adjust as needed
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }