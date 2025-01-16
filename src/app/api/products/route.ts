import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIds = searchParams.get("categoryIds"); // e.g. "64b0f9...,64b1a0..."

    if (!categoryIds) {
      // return ALL products
      const allProducts = await prisma.product.findMany({
        orderBy: { name: "asc" },
        include: { category: true },
      });
      return NextResponse.json(allProducts, { status: 200 });
    } else {
      // Filter by these IDs
      const ids = categoryIds.split(",");
      const filteredProducts = await prisma.product.findMany({
        where: { categoryId: { in: ids } },
        orderBy: { name: "asc" },
        include: { category: true },
      });
      return NextResponse.json(filteredProducts, { status: 200 });
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
