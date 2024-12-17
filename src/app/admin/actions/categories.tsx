import { prisma } from '@/lib/prisma';
import { deleteImageFromS3} from '@/lib/s3';

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