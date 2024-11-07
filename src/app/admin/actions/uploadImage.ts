// src/app/admin/actions/uploadImage.ts

import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// Initialize S3 client
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // AWS Secret Access Key
  region: process.env.AWS_REGION!, // AWS Region
});

/**
 * Uploads a file to AWS S3 and returns the S3 key.
 * @param file - The file to upload.
 * @returns The S3 key of the uploaded file.
 */
export async function uploadImageToS3(file: File): Promise<string> {
  const key = `products/${uuidv4()}-${file.name}`; // Generate a unique key

  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!, // S3 Bucket Name
    Key: key, // S3 Object Key
    Body: file, // File content
    ContentType: file.type, // MIME type of the file
    ACL: "public-read", // Access control list
  };

  await s3.upload(params).promise(); // Upload the file to S3

  return key; // Return the S3 key
}

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param fileName - The name of the file.
 * @param fileType - The MIME type of the file.
 * @returns An object containing the pre-signed URL and the S3 key.
 */
export async function generatePresignedUrl(fileName: string, fileType: string) {
  const key = `products/${uuidv4()}-${fileName}`; // Generate a unique key

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!, // S3 Bucket Name
    Key: key, // S3 Object Key
    Expires: 60, // URL expiration time in seconds
    ContentType: fileType, // MIME type of the file
    ACL: "public-read", // Access control list
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params); // Generate pre-signed URL

  return { uploadURL, key }; // Return the URL and key
}
