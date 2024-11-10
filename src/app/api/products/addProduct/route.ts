// src/app/api/products/addProduct/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import Busboy from 'busboy';
import { uploadImageToS3 } from '@/app/admin/actions/uploadImage';
import { Readable } from 'stream';
import { deleteImageFromS3 } from '@/lib/s3';
import { ServerFile } from '@/types/File';  // Import the ServerFile interface

export const runtime = 'nodejs'; // Specify the runtime environment

// Define a Zod schema for validating the incoming product data
const addSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be at least 0.01.' }),
  categoryId: z.string().min(1, { message: 'Category is required.' }),
  productId: z.string().optional(),
  imagesToRemove: z.string().optional(),
});

interface ParsedForm {
  fields: Record<string, string>;
  files: ServerFile[]; // Changed to an array of ServerFile
}

/**
 * Converts a Fetch ReadableStream to a Node.js Readable stream.
 */
const convertFetchStreamToNodeStream = (stream: ReadableStream<Uint8Array>): Readable => {
  const nodeStream = new Readable({
    read() {},
  });

  const reader = stream.getReader();

  const pump = async () => {
    try {
      const { done, value } = await reader.read();
      if (done) {
        nodeStream.push(null);
        return;
      }
      nodeStream.push(Buffer.from(value));
      pump();
    } catch (err: any) {
      nodeStream.destroy(err);
    }
  };

  pump();

  return nodeStream;
};

/**
 * Parses multipart form data using Busboy.
 */
const parseForm = async (req: Request): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return reject(new Error('Unsupported content type. Expected multipart/form-data.'));
    }

    const busboy = Busboy({ headers: { 'content-type': contentType } });

    const fields: Record<string, string> = {};
    const files: ServerFile[] = []; // Use ServerFile interface

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname:string, file:NodeJS.ReadableStream, filename:string, encoding:string, mimetype:string) => {
      const buffers: Buffer[] = [];

      file.on('data', (data: Buffer) => {
        buffers.push(data);
      });

      file.on('end', () => {
        const fileBuffer = Buffer.concat(buffers);
        files.push({
          fieldname, // Include fieldname
          buffer: fileBuffer,
          filename,
          encoding,
          mimetype,
        });
      });

      file.on('error', (err) => {
        reject(err);
      });
    });

    busboy.on('finish', () => {
      resolve({ fields, files });
    });

    busboy.on('error', (err) => {
      reject(err);
    });

    // Convert the Fetch ReadableStream to a Node.js Readable stream
    if (!req.body) {
      return reject(new Error('No request body found.'));
    }

    const nodeStream = convertFetchStreamToNodeStream(req.body);
    nodeStream.pipe(busboy);
  });
};

/**
 * Validates and parses the form data.
 */
const validateData = (fields: Record<string, string>) => {
  const parseResult = addSchema.safeParse(fields);
  if (!parseResult.success) {
    throw parseResult.error;
  }
  return parseResult.data;
};

/**
 * Handles image uploads and returns the uploaded image keys.
 */
const handleImageUploads = async (
  files: ServerFile[],
  prefix: string
): Promise<string[]> => {
  const uploadPromises = files
    .filter((file) => file.fieldname.startsWith(prefix))
    .map(async (file) => {
      // Optionally validate file type and size here
      return await uploadImageToS3(file);
    });

  const results = await Promise.all(uploadPromises);
  return results.filter((key): key is string => key !== null);
};

/**
 * Handle POST requests to add or update a product
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming form data
    const { fields, files } = await parseForm(request);

    // Validate form data using Zod
    const data = validateData(fields);

    const { name, description, price, categoryId, productId, imagesToRemove } = data;

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

    // Start a Prisma transaction
    const product = await prisma.$transaction(async (prisma) => {
      let product;

      if (productId) {
        // Update existing product
        product = await prisma.product.findUnique({
          where: { id: productId },
        });
        if (!product) {
          throw new Error('Product not found');
        }
        product = await prisma.product.update({
          where: { id: productId },
          data: {
            name,
            description,
            price,
            categoryId,
          },
        });
      } else {
        // Create a new product
        product = await prisma.product.create({
          data: {
            name,
            description,
            price,
            categoryId,
            images: [], // Initialize images as an empty array
          },
        });
      }

      // Start with current images
      let currentImages = product.images || [];

      // Handle imagesToRemove
      if (imagesToRemove) {
        const imagesToRemoveList = imagesToRemove.split(',').filter(Boolean);
        if (imagesToRemoveList.length > 0) {
          // Delete images from S3 before removing them
          await Promise.all(imagesToRemoveList.map(imageKey => deleteImageFromS3(imageKey)));

          // Remove the images from the currentImages array
          currentImages = currentImages.filter(imageKey => !imagesToRemoveList.includes(imageKey));
        }
      }

      // Handle new images
      const newImageKeys = await handleImageUploads(files, 'newImage-');
      if (newImageKeys.length > 0) {
        // Add new image keys to the currentImages array
        currentImages = currentImages.concat(newImageKeys);
      }

      // Update the product with the new images array
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          images: currentImages,
        },
      });

      return product;
    });

    return NextResponse.json(
      { message: 'Product saved successfully', product },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { errors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    console.error('Error adding/updating product:', err);
    return NextResponse.json(
      { errors: { general: [err.message || 'An error occurred while processing the product.'] } },
      { status: 500 }
    );
  }
}
