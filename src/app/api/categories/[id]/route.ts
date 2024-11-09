import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function Delete({ params }: { params: { id: string } }) {
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
        message: "category deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
