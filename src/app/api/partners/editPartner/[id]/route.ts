import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updatePartner } from '@/app/admin/actions/partners';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedPartner = await updatePartner(request, { params });

    // Revalidate the categories page
    revalidatePath("/admin/manage-partners");

    return NextResponse.json(updatedPartner, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.flatten().fieldErrors);
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error("Error updating partner:", err);
    return NextResponse.json(
      { error: "An error occurred while updating the partner." },
      { status: 500 }
    );
  }
}
