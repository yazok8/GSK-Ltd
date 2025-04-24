import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// 1) Mock the exact same path that your code uses
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));


import { getProducts } from '@/app/(customerFacing)/actions/products';
import prisma from '@/lib/prisma'; 

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Products Actions', () => {
  it('should get products successfully', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 19.99,
        images: [],
        inStock: null,
        brand: null,
        categoryId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: '1',
          name: 'Test Category',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ];

    prismaMock.product.findMany.mockResolvedValue(mockProducts);
    prismaMock.product.count.mockResolvedValue(1);

    const result = await getProducts({
      page: 1,
      limit: 10,
      categoryIds: '1',
    });

    expect(result.success).toBe(true);
    expect(result.products).toEqual(mockProducts);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: {
        categoryId: {
          in: ['1'],
        },
      },
      include: { category: true },
      skip: 0,
      take: 10,
    });
  });

  it('should handle empty categoryIds', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);
    prismaMock.product.count.mockResolvedValue(0);

    const result = await getProducts({
      page: 1,
      limit: 10,
    });

    expect(result.success).toBe(true);
    expect(result.products).toEqual([]);
    expect(result.total).toBe(0);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      where: {},
      include: { category: true },
      skip: 0,
      take: 10,
    });
  });

  it('should handle errors', async () => {
    prismaMock.product.findMany.mockRejectedValue(new Error('Database error'));

    const result = await getProducts({
      page: 1,
      limit: 10,
    });

    expect(result.success).toBe(false);
    expect(result.products).toEqual([]);
    expect(result.error).toBe('Failed to fetch products');
  });
});