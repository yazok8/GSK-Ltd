// src/lib/s3.ts

import { S3 } from 'aws-sdk';

// Initialize AWS S3 client with credentials from environment variables
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, 
  region: process.env.AWS_REGION!, 
});

/**
 * Deletes an image from S3.
 * @param key - The S3 object key of the image to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteImageFromS3 = async (key: string): Promise<void> => {
  await s3.deleteObject({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  }).promise();
};
