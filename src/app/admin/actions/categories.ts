export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client,deleteImageFromS3 } from '@/lib/s3';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { S3 } from 'aws-sdk';
import { revalidatePath } from 'next/cache';
import { isPrismaClientKnownRequestError } from 'utils/typeGuards';

async function ensureBucketName(): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME environment variable is not set.');
  }
  return bucketName;
}

// Zod Schemas for Validation
const addSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
});

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return { error: 'Category not found', status: 404 };
    }

    // Delete the category's image from S3 if it exists
    if (category.image) {
      try {
        await deleteImageFromS3(category.image);
      } catch (error) {
        console.error('Failed to delete image from S3:', error);
        // Continue with category deletion even if image deletion fails
      }
    }

    // Delete the category from the database
    await prisma.category.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error: 'Failed to delete category', status: 500 };
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

export async function addCategory(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const image = formData.get("image"); // image is of type File or Blob

    if (!name || !image) {
      return NextResponse.json(
        { errors: { general: ["All fields are required"] } },
        { status: 400 }
      );
    }

    // Validate form data using Zod
    const result = addSchema.safeParse({ name: String(name) });
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = result.data;

    // Check the image is a Blob or File
    if (!(image instanceof Blob)) {
      return NextResponse.json(
        { errors: { image: ["Image must be a file"] } },
        { status: 400 }
      );
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { errors: { image: ["Only image files are allowed"] } },
        { status: 400 }
      );
    }

    // Convert to buffer
    const imageBuffer = await blobToBuffer(image);

    // Enforce max size (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (imageBuffer.length > maxSize) {
      return NextResponse.json(
        { errors: { image: ["Image must be < 10 MB"] } },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const originalFileName = (image as any).name || "uploaded-image.jpg";
    const fileExtension = path.extname(originalFileName) || ".jpg";
    const key = `categories/${uuidv4()}${fileExtension}`;

    // Check env
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable not set.");
    }

    // Upload to S3
    const s3 = new S3(); // or however you're instantiating S3
    await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: image.type,
    }).promise();

    // Create in Prisma
    await prisma.category.create({
      data: {
        name: data.name,
        image: key,
      },
    });

    // Revalidate
    revalidatePath("/admin/manage-categories");

    return NextResponse.json({ message: "Category added successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating category", error);

    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Category must be unique" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}