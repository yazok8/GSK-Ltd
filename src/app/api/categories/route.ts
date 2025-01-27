import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle GET Categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "no-store", // Disable caching
      },
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store", // Disable caching on error as well
        },
      }
    );
  }
}
