// scripts/restore-product-images.js
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

dotenv.config();
const prisma = new PrismaClient();

async function restoreProductImages() {
  try {
    console.log('Starting product image restoration...');
    
    // Configure S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Get all products
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to process`);
    
    // List objects in the products folder
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const listParams = {
      Bucket: bucketName,
      Prefix: 'products/'
    };
    
    const s3Objects = await s3Client.send(new ListObjectsV2Command(listParams));
    console.log(`Found ${s3Objects.Contents?.length || 0} files in S3 products folder`);
    
    // Map of product name variations to S3 keys
    const productNameToS3Keys = {};
    
    // Process S3 objects to create mapping
    for (const obj of s3Objects.Contents || []) {
      const key = obj.Key;
      const fileName = key.split('/').pop().split('.')[0];
      
      // Create variations of the name for matching
      const variations = [
        fileName,
        fileName.toLowerCase(),
        fileName.replace(/-/g, ' '),
        fileName.replace(/-/g, ' ').toLowerCase()
      ];
      
      for (const variation of variations) {
        if (!productNameToS3Keys[variation]) {
          productNameToS3Keys[variation] = [];
        }
        productNameToS3Keys[variation].push(key);
      }
    }
    
    // Update products with matching S3 images
    let updatedCount = 0;
    
    for (const product of products) {
      // Skip products that already have images
      if (product.images && product.images.length > 0 && 
          !product.images.includes('/fallback.jpg') && 
          !product.images.some(img => img.includes('/images/'))) {
        continue;
      }
      
      // Try to find matching images
      const productNameVariations = [
        product.name,
        product.name.toLowerCase(),
        product.name.replace(/\s+/g, '-'),
        product.name.replace(/\s+/g, '-').toLowerCase()
      ];
      
      let foundImages = [];
      
      for (const variation of productNameVariations) {
        if (productNameToS3Keys[variation]) {
          foundImages = productNameToS3Keys[variation];
          break;
        }
      }
      
      // If no direct match, try a fuzzy match
      if (foundImages.length === 0) {
        for (const variation of productNameVariations) {
          for (const [key, values] of Object.entries(productNameToS3Keys)) {
            if (key.includes(variation) || variation.includes(key)) {
              foundImages = values;
              break;
            }
          }
          if (foundImages.length > 0) break;
        }
      }
      
      // Update the product if images were found
      if (foundImages.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: foundImages }
        });
        updatedCount++;
        console.log(`Updated product "${product.name}" with images: ${foundImages.join(', ')}`);
      } else {
        console.log(`No matching images found for product "${product.name}"`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} out of ${products.length} products`);
    
  } catch (error) {
    console.error('Error restoring product images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreProductImages()
  .then(() => console.log('Image restoration process completed'))
  .catch(err => console.error('Failed to restore images:', err));