// src/app/admin/actions/products.tsx

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ServerFile } from '@/types/File';
import { validateData, handleImageUploads } from "../../../../utils/formUtils";
import { deleteImageFromS3 } from '@/lib/s3';
import { revalidatePath } from 'next/cache';
import fs  from 'fs/promises';


 /* Zod schema for adding a product.
 */
export const addSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce.number().min(0, { message: 'Price must be at least 0.' }).optional(),
  categoryId: z.string().min(1, { message: 'Category is required.' }),
});

export async function AddProduct(
  fields: Record<string, string>,
  files: ServerFile[]
) {
  try {
    const data = validateData(fields, addSchema);

    const { name, description, price, categoryId } = data;

    // Verify that the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { errors: { categoryId: ['Selected category does not exist.'] } },
        { status: 400 }
      );
    }

    // Create a new product
    let product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        images: [],
      },
    });

    // Handle new images
    const newImageKeys = await handleImageUploads(files, 'newImage-');
    if (newImageKeys.length > 0) {
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          images: newImageKeys,
        },
      });
    }

    return NextResponse.json(
      { message: 'Product added successfully', product },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error("Validation Error:", err.flatten().fieldErrors);
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error adding product:', err);
    return NextResponse.json(
      { errors: { general: [ 'An error occurred.'] } },
      { status: 500 }
    );
  }
}



export const updateSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce.number().min(0, { message: 'Price must be at least 0.' }).optional(),
  categoryId: z.string().min(1, { message: 'Category is required.' }),
  imagesToRemove: z.string().optional(),
});

export async function UpdateProduct(
  fields: Record<string, string>,
  files: ServerFile[]
) {
  try {
    const data = validateData(fields, updateSchema);

    const { productId, name, description, price, categoryId, imagesToRemove } = data;

    // Verify that the product exists
    let product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json(
        { errors: { productId: ['Product not found.'] } },
        { status: 404 }
      );
    }

    // Check for unique name constraint
    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
        NOT: { id: productId },
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        { errors: { name: ['A product with this name already exists.'] } },
        { status: 400 }
      );
    }

    // Verify that the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { errors: { categoryId: ['Selected category does not exist.'] } },
        { status: 400 }
      );
    }

    // Prepare the data object for updating
    const updateData: any = {
      name,
      description,
      categoryId,
    };

    if (price !== undefined) {
      updateData.price = price === 0 ? null : price; // Set to null if 0, else set the value
    }

    // Update product details
    product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    let currentImages = product.images || [];

    // Handle images to remove
    if (imagesToRemove) {
      const imagesToRemoveList = imagesToRemove.split(',').filter(Boolean);
      if (imagesToRemoveList.length > 0) {
        // Delete images from S3
        await Promise.all(
          imagesToRemoveList.map((imageKey: string) => deleteImageFromS3(imageKey))
        );

        // Remove images from currentImages
        currentImages = currentImages.filter(
          (imageKey) => !imagesToRemoveList.includes(imageKey)
        );
      }
    }

    // Handle new images
    const newImageKeys = await handleImageUploads(files, 'newImage-');
    if (newImageKeys.length > 0) {
      currentImages = currentImages.concat(newImageKeys);
    }

    // Update product images
    product = await prisma.product.update({
      where: { id: product.id },
      data: {
        images: currentImages,
      },
    });

    return NextResponse.json(
      { message: 'Product updated successfully', product },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error('Validation Error:', err.flatten().fieldErrors);
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error updating product:', err);
    return NextResponse.json(
      { errors: { general: ['An error occurred.'] } },
      { status: 500 }
    );
  }
}
  

// The deleteProduct function remains the same
export async function deleteProduct(id: string) {
  try {
    // Delete the product and get the deleted product data
    const product = await prisma.product.delete({
      where: { id },
    });

    if (!product) return { error: 'Product not found.', status: 404 };

    // Check if the product has images
    if (product.images && Array.isArray(product.images)) {
      // Delete each image from the filesystem
      const deletePromises = product.images.map(async (imagePath) => {
        try {
          const fullPath = `public/${imagePath}`; // Adjust the path as necessary
          await fs.unlink(fullPath);
        } catch (error) {
          console.error(`Failed to delete image ${imagePath}:`, error);
        }
      });

      // Await all deletions
      await Promise.all(deletePromises);
    }

    // Revalidate paths to update cached pages
    revalidatePath("/");
    revalidatePath("/manage-products");

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'An error occurred while deleting the product.', status: 500 };
  }
}