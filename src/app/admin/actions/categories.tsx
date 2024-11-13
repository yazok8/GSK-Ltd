// src/app/admin/actions/categories.tsx

import prisma from '@/lib/prisma';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';  // Ensure the S3 client is correctly imported
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export async function deleteCategory(id: string) {
  try {
    // Delete the category and get the deleted category data
    const category = await prisma.category.delete({
      where: { id },
    });

    if (!category) return { error: 'Category not found.', status: 404 };

    // Check if the category has an image
    if (category.image) {
      let key = '';

      if (category.image.startsWith('http://') || category.image.startsWith('https://')) {
        // imageUrl is a full URL
        const url = new URL(category.image);
        key = decodeURIComponent(url.pathname.substring(1)); // Remove leading '/'
      } else {
        // imageUrl is a relative path (key)
        key = category.image;
      }

      const bucketName = process.env.AWS_S3_BUCKET_NAME!;

      // Delete the image from S3
      try {
        const deleteParams = {
          Bucket: bucketName,
          Key: key,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted image from S3: ${key}`);
      } catch (error) {
        console.error(`Failed to delete image from S3 ${key}:`, error);
      }
    }

    // Return success
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

  // Ensure AWS_S3_BUCKET_NAME is set
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set.');
  }

  // Initialize imagePath (optional)
  let imagePath: string | undefined = undefined;

  if (image) {
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      );
    }
    // Read the file as a Buffer
    const imageBuffer = await blobToBuffer(image);

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (imageBuffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Image size should not exceed 10 MB.' },
        { status: 400 }
      );
    }
    // Generate a unique filename
    const originalFilename = (image as any).name || 'uploaded-image';
    const fileExtension = path.extname(originalFilename) || '.jpg'; // Default to .jpg if no extension
    const key = `products/${uuidv4()}${fileExtension}`;

    // Upload image to S3 using AWS SDK v3
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: image.type,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    imagePath = key;
  }
  try {
    // Get the old category data before updating
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found.' },
        { status: 404 }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        ...(imagePath && { image: imagePath }),
      },
    });

    // If a new image was uploaded, delete the old image from S3
    if (imagePath && existingCategory.image) {
      try {
        const deleteParams = {
          Bucket: bucketName,
          Key: existingCategory.image,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
      } catch (error) {
        console.error('Error deleting old image from S3:', error);
        // Decide whether to throw an error or continue
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