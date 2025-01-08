import { NextRequest, NextResponse } from "next/server";
import { deleteCategory } from "@/app/admin/actions/categories";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deletePartner } from "@/app/admin/actions/partners";

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
      { error: "Partner ID is required" },
      { status: 400 }
    );
  }

  // 4. Attempt to delete the partner
  try {
    const result = await deletePartner(id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 }
      );
    }

    // 5. Revalidate the partners page if successful
    revalidatePath("/admin/manage-partners");

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting partner", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
