'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;  // Add callback prop
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

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const isEditing = !!category;
  const [success, setSuccess] = useState<string | null>(null);
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
        : '/api/categories/add-category';

      const method = category ? 'PUT' : 'POST';

      const response = await fetch(catApiEndPoints, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || 'Failed to save category');
      }

      // Call onSuccess callback to trigger parent component refresh
      if (onSuccess) {
        onSuccess();
      }

      // Refresh the router to update server-side props
      router.refresh();
      
      setSuccess(isEditing ? 'Category updated successfully!' : 'Category added successfully!');
      
      if (!isEditing) {
        reset(); // Only reset form for new categories
      }
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push('/admin/manage-categories');
      }, 1500);
      
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Card>
      <CardHeader className="text-2xl font-bold mb-4">
      <CardTitle>  {isEditing ? 'Edit Category' : 'Add Category'}</CardTitle>
      </CardHeader>
      <CardContent className='bg-white border-solid b-4 shadow-xl'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className='mt-4'>
            <Label className='mt-4' htmlFor="name">Category Name</Label>
            <Input id="name" {...register('name')} className='border-solid b-2'/>
            {errors.name && (
              <p className="text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className='mt-4'>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} className='border-solid b-2' />
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
              className='border-solid b-2'

            />
          </div>
          {errors.image && (
            <p className="text-destructive">{errors.image.message}</p>
          )}
        </div>
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Adding...'
            : isEditing
            ? 'Update Category'
            : 'Add Category'}
        </Button>
      </form>
      </CardContent>
    </Card>
  );
}