// e2e/setup/globalSetup.ts
import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test prefix to isolate test data
const TEST_PREFIX = 'PLAYWRIGHT_TEST_';

// Get MongoDB client
async function getMongoClient() {
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/gsk_ltd_test';
  const client = new MongoClient(url);
  await client.connect();
  return client;
}

async function createTestImages() {
  // Create test images directory if it doesn't exist
  const imagesDir = path.join(__dirname, '../../public/test-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Create a simple test image if it doesn't exist
  const testImagePath = path.join(imagesDir, 'test-fallback.jpg');
  if (!fs.existsSync(testImagePath)) {
    // Simple 1x1 JPEG
    const simpleJpeg = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 
      0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 
      0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 
      0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01, 0x00, 
      0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
      0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 
      0x00, 0xFF, 0xD9
    ]);
    fs.writeFileSync(testImagePath, simpleJpeg);
    
    // Copy the same image for other test images
    fs.copyFileSync(testImagePath, path.join(imagesDir, 'test-category.jpg'));
    fs.copyFileSync(testImagePath, path.join(imagesDir, 'test-product-image.jpg'));
  }
}

async function cleanupTestDatabase() {
  console.log('Cleaning up test database using direct MongoDB client...');
  
  try {
    const client = await getMongoClient();
    const db = client.db();
    
    // Delete products with test prefix
    await db.collection('Product').deleteMany({
      name: { $regex: `^${TEST_PREFIX}` }
    });
    
    // Delete categories with test prefix
    await db.collection('Category').deleteMany({
      name: { $regex: `^${TEST_PREFIX}` }
    });
    
    await client.close();
    console.log('Test database cleaned up successfully.');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  }
}

async function seedTestDatabase() {
  console.log('Seeding test database using direct MongoDB client...');
  
  let client;
  try {
    // First, clean up any existing test data
    await cleanupTestDatabase();
    
    client = await getMongoClient();
    const db = client.db();
    
    // Create test category directly with MongoDB
    const categoryResult = await db.collection('Category').insertOne({
      name: `${TEST_PREFIX}Category`,
      image: '/test-images/test-category.jpg',
      description: 'Test category for E2E tests',
      featured: true
    });
    
    const categoryId = categoryResult.insertedId;
    console.log(`Created test category with ID: ${categoryId}`);
    
    // Create test products directly with MongoDB
    const productPromises = [];
    for (let i = 0; i < 5; i++) {
      productPromises.push(
        db.collection('Product').insertOne({
          name: `${TEST_PREFIX}Product ${i+1}`,
          description: `Test product ${i+1} description`,
          price: 9.99 + i,
          images: ['/test-images/test-product-image.jpg'],
          inStock: true,
          brand: `${TEST_PREFIX}Brand`,
          categoryId: categoryId
        })
      );
    }
    
    await Promise.all(productPromises);
    console.log('Test database seeded successfully with 5 products.');
  } catch (error) {
    console.error('Error seeding test database:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function globalSetup(config: FullConfig) {
  try {
    // Verify we're in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Warning: Running test setup outside of test environment!');
    }
    
    // Create test images in a separate directory
    await createTestImages();
    
    // Seed database with test data
    await seedTestDatabase();
  } catch (error) {
    console.error('Error in global setup:', error);
    process.exit(1);
  }
}

export default globalSetup;