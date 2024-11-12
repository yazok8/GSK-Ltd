// src/lib/deleteCategory.ts

import prisma from '@/lib/prisma';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3';  // Ensure the S3 client is correctly imported

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
