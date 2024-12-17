// src/app/admin/actions/categories.tsx
export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

async function ensureBucketName(): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set.');
  }
  return bucketName;
}

export async function deleteCategory(id: string) {
  try {
    const existingCategory = await prisma.category.findUnique({ where: { id }});

    if (!existingCategory) {
      return { error: 'Category not found.', status: 404 };
    }

    // Delete category from database
    const category = await prisma.category.delete({ where: { id } });

    // If the category had an image, attempt to delete it from S3
    if (category.image) {
      try {
        const bucketName = await ensureBucketName();

        let key: string;
        if (category.image.startsWith('http://') || category.image.startsWith('https://')) {
          const url = new URL(category.image);
          key = decodeURIComponent(url.pathname.substring(1));
        } else {
          key = category.image;
        }

        const deleteParams = {
          Bucket: bucketName,
          Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted image from S3: ${key}`);
      } catch (error) {
        console.error('Failed to delete image from S3:', error);
        // Continue without throwing to avoid masking the successful DB deletion
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error: 'An error occurred while deleting the category.', status: 500 };
  }
}

// Helper function to convert Blob to Buffer
export async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function updateCategory(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const image = formData.get('image') as File | null;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const bucketName = await ensureBucketName();

    let imagePath: string | undefined = undefined;

    // Handle image upload if provided
    if (image) {
      if (!image.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed.' },
          { status: 400 }
        );
      }

      const imageBuffer = await blobToBuffer(image);
      const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
      if (imageBuffer.length > MAX_SIZE) {
        return NextResponse.json(
          { error: 'Image size should not exceed 10 MB.' },
          { status: 400 }
        );
      }

      const originalFilename = (image as any).name || 'uploaded-image';
      const fileExtension = path.extname(originalFilename) || '.jpg'; 
      const key = `products/${uuidv4()}${fileExtension}`;

      const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: imageBuffer,
        ContentType: image.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      imagePath = key;
    }

    // Fetch existing category to update
    const existingCategory = await prisma.category.findUnique({ where: { id }});
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found.' },
        { status: 404 }
      );
    }

    // Update category in database
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        ...(imagePath && { image: imagePath }),
      },
    });

    // If a new image was uploaded, delete the old one from S3
    if (imagePath && existingCategory.image) {
      try {
        const deleteParams = {
          Bucket: bucketName,
          Key: existingCategory.image,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted old image from S3: ${existingCategory.image}`);
      } catch (error) {
        console.error('Error deleting old image from S3:', error);
        // You may choose to return an error or continue silently
      }
    }

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
