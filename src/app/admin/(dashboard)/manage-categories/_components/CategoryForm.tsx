// src/app/admin/(dashboard)/manage-categories/_components/CategoryForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  category?: Category | null;
}

interface CategoryFormInputs {
  name: string;
  image?: FileList;
  description?: string;
}

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z
    .any()
    .refine((files) => files && files.length === 1, 'Image is required'),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  image: z
    .any()
    .refine(
      (files) => !files || files.length <= 1,
      'Only one image can be uploaded'
    )
    .optional(),
  description: z.string().optional(),
});

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category;
  const [success, setSuccess] = useState<string | null>(null);
   // State for form feedback
   const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(
      isEditing ? updateCategorySchema : createCategorySchema
    ),
    defaultValues: isEditing
      ? {
          name: category?.name || '',
          description: category?.description || '',
        }
      : {},
  });

  const onSubmit = async (data: CategoryFormInputs) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const catApiEndPoints = category
        ? `/api/categories/edit-category/${category?.id}`
        : '/api/categories';

      // Determine the HTTP method based on whether we're editing or creating
      const method = category ? 'PUT' : 'POST';

      // Send the form data to the server with the correct HTTP method
      const response = await fetch(catApiEndPoints, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || 'Failed to save category');
      }
      router.push('/admin/manage-categories');
      reset();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Category' : 'Add Category'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className='mt-4'>
          <Label className='mt-4' htmlFor="name">Category Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-destructive">{errors.name.message}</p>
          )}
          </div>
          <div className='mt-4'>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register('description')} />
          </div>
          {isEditing && category?.image && (
            <div>
              <Label>Current Image</Label>
              <Image
                src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`}
                alt={category.name}
                className="h-20 w-20 object-cover"
                width={200}
                height={100}
              />
            </div>
          )}
        <div className='mt-4'>
          <Label htmlFor="image">
            {isEditing ? 'Upload New Image (optional)' : 'Category Image'}
          </Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register('image')}
          />
          </div>
          {errors.image && (
            <p className="text-destructive">{errors.image.message}</p>
          )}
        </div>
        {success && <div className="text-green-500">{success}</div>}
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Adding...'
            : isEditing
            ? 'Update Category'
            : 'Add Category'}
        </Button>
      </form>
    </div>
  );
}
