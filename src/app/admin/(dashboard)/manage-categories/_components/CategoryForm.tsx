"use client";
export const runtime = 'nodejs';

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

type Category = Prisma.ProductGetPayload<object>;

interface CategoryFormInputs {
  name: string;
  image: FileList;
}

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z
    .any()
    .refine((files) => files && files.length === 1, "Image is required")
    .refine(
      (files) =>
        files &&
        files[0] &&
        ["image/jpeg", "image/png", "image/gif"].includes(files[0].type),
      "Only JPEG, PNG,WEBP, GIF images are allowed"
    ),
});

export default function CategoryForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInputs>({ resolver: zodResolver(categorySchema) });

  // State for new images to be added

  const onSubmit = async (data: CategoryFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("image", data.image[0]);
  
      const response = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to add category");
      }
  
      const newCategory: Category = await response.json();
      setCategories([...categories, newCategory]);
      reset();
    } catch (err: unknown) {
      console.error(err);
    }
  };
  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className='space-y-4'>
          <Label htmlFor="name">Category Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-destructive">{errors.name.message}</p>
          )}
          <Input
          id="image"
          type="file"
          accept="image/*"
          {...register("image")}
        />
        {errors.image && (
          <p className="text-destructive">{errors.image.message}</p>
        )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Category"}
        </Button>
      </form>
    </div>
  );
}
