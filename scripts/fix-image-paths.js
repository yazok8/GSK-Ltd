// scripts/fix-image-paths.js
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function fixImagePaths() {
  console.log('Starting image path fix...');
  
  // 1. Fix categories with incorrect paths
  const categories = await prisma.category.findMany();
  
  for (const category of categories) {
    let image = category.image;
    
    // Detect and fix incorrect paths
    if (image === '/images/fallback.jpg' || image === '/images/test-category.jpg') {
      // Get original path from S3 or set to a default
      const correctPath = `categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.webp`;
      
      await prisma.category.update({
        where: { id: category.id },
        data: { image: correctPath }
      });
      
      console.log(`Fixed category "${category.name}" image from "${image}" to "${correctPath}"`);
    }
  }
  
  // 2. Fix products with incorrect images
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    if (Array.isArray(product.images)) {
      const fixedImages = product.images.map(img => {
        if (img === '/images/fallback.jpg' || !img) {
          // Replace with correct path based on product
          return `products/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        }
        return img;
      });
      
      if (JSON.stringify(fixedImages) !== JSON.stringify(product.images)) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: fixedImages }
        });
        
        console.log(`Fixed product "${product.name}" images from "${product.images}" to "${fixedImages}"`);
      }
    }
  }
  
  console.log('Image path fix completed!');
}

fixImagePaths()
  .catch(e => {
    console.error('Error fixing image paths:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });