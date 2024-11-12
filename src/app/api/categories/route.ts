import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isPrismaClientKnownRequestError } from "../../../../utils/typeGuards";

//Handle GET Categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
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

// Handle POST Categories
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json({
        error: "Category name is required and must be a string",
      }, { status: 400 });
    }
    const newCategory = await prisma.category.create({
      data: { name: name.trim() },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category", error);
    
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Category must be unique" },
          { status: 409 }
        );
      }
      // Handle other Prisma known errors if necessary
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}