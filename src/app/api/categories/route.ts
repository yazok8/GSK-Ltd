//src/app/api/categories/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isPrismaClientKnownRequestError } from "../../../../utils/typeGuards";
import path from "path";
import { z } from "zod";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

//Handle GET Categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION as string,
});

// Zod Schemas for Validation
const addSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
});

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Handle POST Categories
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const image = formData.get("image"); // image is of type File

    if (!name || !image) {
      return NextResponse.json(
        { errors: { general: ["All fields are required"] } },
        { status: 400 }
      );
    }

    //validate form data using Zod
    const result = addSchema.safeParse({
      name: String(name),
    });
    if (!result.success) {
      return NextResponse.json(
        {
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    if (!(image instanceof Blob)) {
      return NextResponse.json(
        { errors: { image: ["Image is required and must be a file"] } },
        { status: 400 }
      );
    }
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { errors: { image: ["Only image files are allowed"] } },
        { status: 400 }
      );
    }

    //Reead the files as a buffer
    const imageBufer = await blobToBuffer(image);

    //enforce the file as a buffer

    const max_size = 10 * 1024 * 1024;
    if (imageBufer.length > max_size) {
      return NextResponse.json(
        { errors: { image: ["Image size should not exceed 10 MB."] } },
        { status: 400 }
      );
    }

    // Generate a unique filename
    // Since Blob does not have a 'name' property, handle filename accordingly
    // Assuming the client sends the filename as part of the form data or another method
    // If not, default to a generic name with extension
    const originalFileName = (image as any).name || "uploaded-image";
    const fileExtension = path.extname(originalFileName) || "jpg";
    const key = `categories/${uuidv4()}${fileExtension}`;

    // Ensure AWS_S3_BUCKET_NAME is set
    if (!process.env.AWS_S3_BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set.");
    }

    // Upload image to S3
    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: imageBufer,
      ContentType: image.type,
    };

    await s3.upload(params).promise(); 
    await prisma.category.create({
      data:{
        name:data.name, 
        image:key
      }
    })
    // Revalidate the cache for the categories page
    revalidatePath('/admin/manage-categories');


    // Respond with success
    return NextResponse.json({ message: 'Category added successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error creating category", error);

    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Category must be unique" },
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