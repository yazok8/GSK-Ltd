// src/app/admin/actions/uploadImage.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ServerFile } from '@/types/File';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});

/**
 * Uploads an image file to AWS S3.
 * @param file The file to upload.
 * @returns The key of the uploaded file in S3.
 */
export const uploadImageToS3 = async (file: ServerFile): Promise<string | null> => {
  try {
    // Generate a unique filename
    const fileExtension = file.filename.split('.').pop();
    const key = `images/${randomUUID()}.${fileExtension}`;

    // Prepare the upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload the file to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return key;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return null;
  }
};
