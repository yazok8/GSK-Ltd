import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

//Handle GET Categories
export async function GET() {
  try {
    const categories = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}