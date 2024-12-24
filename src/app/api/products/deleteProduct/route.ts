// src/app/api/products/deleteProduct/route.ts
import { deleteProduct } from "@/app/admin/actions/products";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';

export async function POST(request: Request, respone:NextResponse) {

    // 1. Get session from next-auth
    const session = await getServerSession(authOptions);
  
    // 2. Block if no session or user is VIEW_ONLY
    if (!session || session.user?.role === "VIEW_ONLY") {
      return NextResponse.json(
        { error: "You do not have permission to delete categories." },
        { status: 403 }
      );
    }

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Call the deleteProduct function
    const result = await deleteProduct(id);

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: result.status || 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Product deleted successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while deleting the product.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

