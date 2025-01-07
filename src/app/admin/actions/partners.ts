import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "aws-sdk";
import { revalidatePath } from "next/cache";
import { isPrismaClientKnownRequestError } from "utils/typeGuards";
import { deleteImageFromS3, s3Client } from "@/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

async function ensureBucketName(): Promise<string> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set.");
  }
  return bucketName;
}

export const addSchema = z.object({
  partnerName: z.string().min(1, { message: "Name is required." }),
});

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function addPartner(req: NextRequest) {
    try {
      const formData = await req.formData();
  
      const name = formData.get("name");
      const logo = formData.get("logo"); // <-- consistent "logo" key
  
      if (!name || !logo) {
        return NextResponse.json(
          { errors: { general: ["All fields are required"] } },
          { status: 400 }
        );
      }
  
      // Validate name with Zod
      const result = addSchema.safeParse({ partnerName: String(name) });
      if (!result.success) {
        return NextResponse.json(
          { errors: result.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      const data = result.data;
  
      // Check if the file is actually a Blob/File
      if (!(logo instanceof Blob)) {
        return NextResponse.json(
          { errors: { logo: ["Logo must be a file"] } },
          { status: 400 }
        );
      }
  
      // Ensure it's an image type
      if (!logo.type.startsWith("image/")) {
        return NextResponse.json(
          { errors: { logo: ["Only image files are allowed"] } },
          { status: 400 }
        );
      }
  
      // Convert the Blob to a buffer
      const logoBuffer = await blobToBuffer(logo);
  
      // Enforce max size (10 MB)
      const maxSize = 10 * 1024 * 1024;
      if (logoBuffer.length > maxSize) {
        return NextResponse.json(
          { errors: { logo: ["Image must be < 10 MB"] } },
          { status: 400 }
        );
      }
  
      // Generate a unique filename
      const originalFileName = (logo as any).name || "uploaded-logo.jpg";
      const fileExtension = path.extname(originalFileName) || ".jpg";
      const key = `partners/${uuidv4()}${fileExtension}`;
  
      // Check S3 environment variable
      if (!process.env.AWS_S3_BUCKET_NAME) {
        throw new Error("AWS_S3_BUCKET_NAME is not set.");
      }
  
      // Upload to S3 (using AWS SDK v2 or v3, whichever you prefer)
      const s3 = new S3();
      await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: logoBuffer,
          ContentType: logo.type,
        })
        .promise();
  
      // Create new partner in the database
      await prisma.partner.create({
        data: {
          name: data.partnerName,
          logo: key,
        },
      });
  
      // Revalidate path if needed
      revalidatePath("/admin/manage-partners");
  
      return NextResponse.json(
        { message: "Partner added successfully" },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error creating partner:", error);
  
      if (isPrismaClientKnownRequestError(error)) {
        if (error.code === "P2002") {
          return NextResponse.json(
            { error: "Partner must be unique" },
            { status: 409 }
          );
        }
      }
  
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

export async function deletePartner(id: string) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return { error: "Partner not found", status: 404 };
    }

    // Delete the category's image from S3 if it exists
    if (partner.logo) {
      try {
        await deleteImageFromS3(partner.logo);
      } catch (error) {
        console.error("Failed to delete image from S3:", error);
        // Continue with category deletion even if image deletion fails
      }
    }

    // Delete the partner from the database
    await prisma.partner.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting partner:", error);
    return { error: "Failed to delete partner", status: 500 };
  }
}
