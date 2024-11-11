


// src/app/api/products/addProduct/route.ts

import { NextResponse } from 'next/server';
import { parseForm } from "../../../../../utils/formUtils";
import { UpdateProduct } from '@/app/admin/actions/products';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const response = await UpdateProduct(fields, files);

    return response;
  } catch (err) {
    console.error('Error in AddProduct POST handler:', err);
    return NextResponse.json(
      { errors: { general: ['An error occurred while processing the request.'] } },
      { status: 500 }
    );
  }
}
