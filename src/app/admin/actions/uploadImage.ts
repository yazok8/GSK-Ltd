// src/app/admin/actions/uploadImage.ts

import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ServerFile } from "@/types/File"; 

// Initialize S3 client
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // AWS Secret Access Key
  region: process.env.AWS_REGION!, // AWS Region
});

/**
 * Uploads a file to AWS S3 and returns the S3 key.
 */
export async function uploadImageToS3(file: ServerFile): Promise<string> {
  try {
    const key = `products/${uuidv4()}-${file.filename}`; // Generate a unique key

    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!, 
      Key: key, 
      Body: file.buffer, 
      ContentType: file.mimetype, 
      // ACL: "public-read"
    };

    await s3.upload(params).promise(); 

    return key;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}
