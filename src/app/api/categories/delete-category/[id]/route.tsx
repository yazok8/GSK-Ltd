import { NextRequest, NextResponse } from "next/server";
import { deleteCategory } from "@/app/admin/actions/categories";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Get session from next-auth
  const session = await getServerSession(authOptions);

  // 2. Block if no session or user is VIEW_ONLY
  if (!session || session.user?.role === "VIEW_ONLY") {
    return NextResponse.json(
      { error: "You do not have permission to delete categories." },
      { status: 403 }
    );
  }

  // 3. Validate ID
  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  // 4. Attempt to delete the category
  try {
    const result = await deleteCategory(id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 }
      );
    }

    // 5. Revalidate the categories page if successful
    revalidatePath("/admin/manage-categories");

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
