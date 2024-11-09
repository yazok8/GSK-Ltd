// src/app/api/products/addProduct/route.ts

import { NextResponse } from 'next/server'; // Helper for creating Next.js responses
import { prisma } from '@/lib/prisma'; // Prisma client for database operations
import { z } from 'zod'; // Zod library for schema validation
import Busboy from 'busboy'; // Busboy library for parsing multipart form data
import { S3 } from 'aws-sdk'; // AWS SDK for interacting with S3
import { v4 as uuidv4 } from 'uuid'; // UUID library for generating unique IDs
import path from 'path'; // Node.js module for handling file paths
import { Readable } from 'stream'; // Node.js module for working with streams
import { uploadImageToS3 } from '@/app/admin/actions/uploadImage'; // Import the upload function

export const runtime = 'nodejs'; // Specify the runtime environment

// Initialize AWS S3 client with credentials from environment variables
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // AWS Secret Access Key
  region: process.env.AWS_REGION!, // AWS Region
});

// Define a Zod schema for validating the incoming product data
const addSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }), // Product name must be at least 1 character
  description: z.string().min(1, { message: 'Description is required.' }), // Description must be at least 1 character
  price: z.coerce.number().min(0.01, { message: 'Price must be at least 0.01.' }), // Price must be at least 0.01
  categoryId: z.string().min(1, { message: 'Category is required.' }), // Category ID must be provided
});

/**
 * Parses multipart form data using Busboy.
 * @param req - The incoming Request object.
 * @returns A promise that resolves to an object containing parsed fields and files.
 */
const parseForm = async (
  req: Request
): Promise<{ fields: Record<string, string>; files: Record<string, any> }> => {
  return new Promise(async (resolve, reject) => {
    // Get the content type from the request headers
    const contentType = req.headers.get('content-type') || '';

    // Initialize Busboy with the content type header
    const busboy = Busboy({ headers: { 'content-type': contentType } });

    // Objects to store form fields and files
    const fields: Record<string, string> = {};
    const files: Record<
      string,
      {
        buffer: Buffer;
        filename: string;
        encoding: string;
        mimetype: string;
      }
    > = {};

    // Listen for 'field' events to collect regular form fields
    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val; 
    });

    // Listen for 'file' events to collect file uploads
    busboy.on(
      'file',
      (
        fieldname: string, 
        file: Readable, 
        filename: string,
        encoding: string,
        mimetype: string 
      ) => {
        const buffers: Buffer[] = []; // Array to hold file data chunks

        // Collect data chunks as they are received
        file.on('data', (data: Buffer) => {
          buffers.push(data);
        });

        // When the file stream ends, concatenate the data chunks
        file.on('end', () => {
          const fileBuffer = Buffer.concat(buffers);
          files[fieldname] = {
            buffer: fileBuffer,
            filename, 
            encoding, 
            mimetype, 
          };
        });
      }
    );

    // When all form data has been processed
    busboy.on('finish', () => {
      resolve({ fields, files }); 
    });

    // Handle errors during parsing
    busboy.on('error', (err) => {
      reject(err); 
    });

    // Read the request body as a buffer and pass it to Busboy
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    busboy.end(buffer); 
  });
};

/**
 * Handle POST requests to add or update a product
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming form data
    const { fields, files } = await parseForm(request);

    // Extract form fields
    const name = fields.name;
    const description = fields.description;
    const priceString = fields.price;
    const categoryId = fields.categoryId;
    const productId = fields.productId; // Ensure 'productId' is included in the form for updates

    // Validate form data using Zod
    const result = addSchema.safeParse({
      name,
      description,
      price: parseFloat(priceString),
      categoryId,
    });

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify that the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { errors: { categoryId: ['Selected category does not exist.'] } },
        { status: 400 }
      );
    }

    // Access the uploaded image files
    const imagesToRemove = (fields.imagesToRemove || '').split(',').filter(Boolean); // Assuming imagesToRemove is a comma-separated string
    const replacementImages = (fields.replacementImages || '').split(',').filter(Boolean); // Similarly for replacementImages
    const replacementImageIds = (fields.replacementImageIds || '').split(',').filter(Boolean); // And for replacementImageIds

    // Handle image removals
    if (imagesToRemove.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: imagesToRemove },
        },
      });
    }

    // Handle image replacements
    for (let i = 0; i < replacementImageIds.length; i++) {
      const imageId = replacementImageIds[i];
      const file = files[`replacementImages[${i}]`]; // Ensure your form names match this pattern

      if (file) {
        const newImageKey = await uploadImageToS3(file); // Upload to S3

        // Update the image record
        await prisma.image.update({
          where: { id: imageId },
          data: { image: newImageKey },
        });
      }
    }

    // Handle new images
    const newImages = Object.values(files).filter((file) => file.fieldname === 'newImages'); // Adjust fieldname as needed

    let product: ProductWithImages | null = null;

    if (productId) {
      // Update existing product
      product = await prisma.product.update({
        where: { id: productId },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
        },
        include: { images: true },
      });
    } else {
      // Create a new product
      product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
        },
        include: { images: true },
      });
    }

    // Upload and associate new images
    for (const file of newImages) {
      const newImageKey = await uploadImageToS3(file); // Upload to S3

      await prisma.image.create({
        data: {
          image: newImageKey,
          productId: product!.id, // Non-null assertion since product is created or updated
        },
      });
    }

    // ... handle other form fields and update the product record as needed

    return NextResponse.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Error adding/updating product:', err);
    return NextResponse.json(
      { errors: { general: [err.message || 'An error occurred while processing the product.'] } },
      { status: 500 }
    );
  }
}
