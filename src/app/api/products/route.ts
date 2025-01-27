import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryIds = searchParams.get('categoryIds');
    const expandedId = searchParams.get('expandedId');

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

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}