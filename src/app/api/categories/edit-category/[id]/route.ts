import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateCategory } from "@/app/admin/actions/categories";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedCategory = await updateCategory(request, { params });

    // Revalidate the categories page
    revalidatePath("/admin/manage-categories");

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.flatten().fieldErrors);
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("Error updating category:", err);
    return NextResponse.json(
      { error: "An error occurred while updating the category." },
      { status: 500 }
    );
  }
}
