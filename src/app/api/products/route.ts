import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 20;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const categoryIds = searchParams.get("categoryIds")?.split(",");
    
    const whereClause = categoryIds?.length 
      ? { categoryId: { in: categoryIds } }
      : {};

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { name: "asc" },
        include: { category: true },
        skip: (page - 1) * PRODUCTS_PER_PAGE,
        take: PRODUCTS_PER_PAGE,
      }),
      prisma.product.count({ where: whereClause })
    ]);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / PRODUCTS_PER_PAGE),
      totalProducts: total
    }, { status: 200 });

  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    );
  }
}