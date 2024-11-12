// src/app/api/categories/[id]/route.ts

"use server"; // Depending on your use case; "use client" is not typically used in API routes

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isPrismaClientKnownRequestError } from "../../../../../utils/typeGuards"; // Ensure this path is correct

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      {
        error: "Category ID is required",
      },
      { status: 400 }
    );
  }

  try {
    const categoryWithProducts = await prisma.product.findFirst({
      where: { categoryId: id },
    });
    if (categoryWithProducts) {
      return NextResponse.json(
        {
          error: "Cannot delete category with associated products",
        },
        { status: 400 }
      );
    }
    const deleteCategory = await prisma.category.delete({
      where: { id },
    });
    if (!deleteCategory) {
      return NextResponse.json(
        {
          error: "Category not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Category deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting category", error);

    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Cannot delete category with associated products" },
          { status: 400 }
        );
      }
      // Handle other known Prisma errors if necessary
    }

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
