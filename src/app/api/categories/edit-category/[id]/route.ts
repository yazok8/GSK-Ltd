//src/app/api/categories/edit-category/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DeleteObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import { z } from 'zod';
import { s3Client } from '@/lib/s3';
import { updateCategory } from '@/app/admin/actions/categories';


// Helper function to convert Blob to Buffer
export async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {


  try {
    const updatedCategory = await updateCategory(request, { params });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.error('Validation Error:', err.flatten().fieldErrors);
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error('Error updating category:', err);
    return NextResponse.json(
      { error: 'An error occurred while updating the category.' },
      { status: 500 }
    );
  }
}
