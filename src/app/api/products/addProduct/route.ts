// src/app/api/products/addProduct/route.ts

import { NextResponse } from 'next/server'; // Helper for creating Next.js responses
import { prisma } from '@/lib/prisma'; // Prisma client for database operations
import { z } from 'zod'; // Zod library for schema validation
import Busboy from 'busboy'; // Busboy library for parsing multipart form data
import { S3 } from 'aws-sdk'; // AWS SDK for interacting with S3
import { v4 as uuidv4 } from 'uuid'; // UUID library for generating unique IDs
import path from 'path'; // Node.js module for handling file paths
import { Readable } from 'stream'; // Node.js module for working with streams

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

// Handle POST requests to add a new product
export async function POST(request: Request) {
  try {
    // Parse the incoming form data
    const { fields, files } = await parseForm(request);

    // Extract and assign form fields
    const name = fields.name;
    const description = fields.description;
    const priceString = fields.price;
    const categoryId = fields.categoryId;

    // Validate the form data using the Zod schema
    const result = addSchema.safeParse({
      name,
      description,
      price: parseFloat(priceString), // Convert price to a number
      categoryId,
    });

    // If validation fails, return the validation errors
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors }, // Flattened error messages
        { status: 400 } // Bad Request status code
      );
    }

    const data = result.data; // Validated data

    // Check if the provided category exists in the database
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    // If the category does not exist, return an error
    if (!categoryExists) {
      return NextResponse.json(
        { errors: { categoryId: ['Selected category does not exist.'] } },
        { status: 400 }
      );
    }

    // Access the uploaded image file
    const imageFile = files.image;

    // If no image file is uploaded, return an error
    if (!imageFile) {
      return NextResponse.json(
        { errors: { image: ['Image is required and must be a file.'] } },
        { status: 400 }
      );
    }

    // Validate that the uploaded file is an image
    if (imageFile.mimetype && !imageFile.mimetype.startsWith('image/')) {
      return NextResponse.json(
        { errors: { image: ['Only image files are allowed.'] } },
        { status: 400 }
      );
    }

    // Enforce a maximum image file size of 10 MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
    if (imageFile.buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { errors: { image: ['Image size should not exceed 10 MB.'] } },
        { status: 400 }
      );
    }

    const imageBuffer = imageFile.buffer; // Buffer containing the image data

    // Generate a unique filename for the image
    const originalFilename = imageFile.filename || 'uploaded-image';
    const fileExtension = path.extname(originalFilename) || '.jpg'; 
    const key = `products/${uuidv4()}${fileExtension}`;

    // Ensure the S3 bucket name is provided in the environment variables
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('AWS_S3_BUCKET_NAME environment variable is not set.');
    }

    // Set up parameters for uploading the image to S3
    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 bucket name
      Key: key, // S3 object key (file path)
      Body: imageBuffer, // Image data
      ContentType: imageFile.mimetype || 'image/jpeg', // MIME type of the image
    };

    // Upload the image to S3
    await s3.upload(params).promise();

    // Create a new product record in the database
    const newProduct = await prisma.product.create({
      data: {
        name: data.name, 
        description: data.description, 
        price: data.price, 
        inStock: false, 
        categoryId: data.categoryId, 
      },
    });

    // Create a new image record linked to the product
    await prisma.image.create({
      data: {
        image: key,
        productId: newProduct.id, 
      },
    });

    // Return a success response
    return NextResponse.json({ message: 'Product added successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Error adding product:', err);

    // Return a server error response with a general error message
    return NextResponse.json(
      { errors: { general: [err.message || 'An error occurred while adding the product.'] } },
      { status: 500 }
    );
  }
}
