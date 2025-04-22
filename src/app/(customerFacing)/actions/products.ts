// actions/products.ts
import prisma from '@/lib/prisma';

export type ProductsParams = {
  page?: number;
  limit?: number;
  categoryIds?: string | null;
  expandedId?: string | null;
};

export async function getProducts({
  page = 1,
  limit = 20,
  categoryIds = null,
  expandedId = null,
}: ProductsParams = {}) {
  try {
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      ...(categoryIds?.trim() && {
        categoryId: {
          in: categoryIds.split(',').filter(id => id.trim() !== '')
        }
      }),
      ...(expandedId && {
        OR: [
          { id: expandedId },
          { categoryId: { in: categoryIds?.split(',') || [] } }
        ]
      })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      success: true
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      currentPage: page,
      totalPages: 0,
      total: 0,
      success: false,
      error: 'Failed to fetch products'
    };
  }
}