// src/app/admin/components/ProductForm.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageSrc } from '@/lib/imageHelper';
import { Prisma, Category } from '@prisma/client';
import { formatPrice } from '../../../../utils/formatPrice';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Product = Prisma.ProductGetPayload<object>;

export default function ProductForm({
  product,
}: {
  product: Product | null;
}) {
  // State for existing images
  const [existingImages, setExistingImages] = useState<string[]>(
    () => product?.images || []
  );

  // State for images to remove
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  // State for new images to be added
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // State for form feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for other form fields
  const [price, setPrice] = useState<number | undefined>(product?.price);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product?.categoryId || ""
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [pending, setPending] = useState<boolean>(false);

  // Fetch categories on component mount
  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  /**
   * Handles changes to new image inputs.
   */
  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages((prevFiles) => [...prevFiles, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  /**
   * Handles removing an existing image.
   */
  const handleRemoveExistingImage = (imageKey: string) => {
    setExistingImages((prevImages) => prevImages.filter((img) => img !== imageKey));
    setImagesToRemove((prevImagesToRemove) => [...prevImagesToRemove, imageKey]);
  };

  /**
   * Handles removing a new image before submission.
   */
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setNewImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Append new images with unique field names
      newImages.forEach((file, index) => {
        formData.append(`newImage-${index}`, file);
      });

      // Append imagesToRemove
      if (imagesToRemove.length > 0) {
        formData.append('imagesToRemove', imagesToRemove.join(','));
      }

      // Append productId if editing
      if (product) {
        formData.append('productId', product.id);
      }

      const apiEndpoint = product
      ? '/api/products/updateProduct'
      : '/api/products/addProduct';

      // Send the form data to the server
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });


      if (response.ok) {
        setSuccess('Product saved successfully!');
        // Optionally, reset the form or redirect
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.general?.[0] || 'An error occurred.');
      }
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add A Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product?.name || ""}
            />
          </div>

          {/* Product Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || undefined)}
            />
            <div className="text-muted-foreground">
              {formatPrice(price ? price : 0)}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description || ""}
            />
          </div>

          {/* Category Field */}
          <div className="space-y-2 text-sm">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="" className="text-sm">Select a category</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Existing Images */}
          <div className="space-y-2">
            <Label>Existing Images</Label>
            {existingImages.map((imageKey, index) => (
              <div key={index} className="relative">
                <Image
                  src={getImageSrc(imageKey)}
                  alt={`Existing Image ${index + 1}`}
                  width={200}
                  height={200}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imageKey)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-md"
                  aria-label={`Remove existing image ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add New Images */}
          <div className="space-y-2">
            <Label htmlFor="new-images">Add New Images</Label>
            <Input
              type="file"
              id="new-images"
              name="newImages" // Name attribute is not crucial here
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
            />
            {newImagePreviews.map((url, index) => (
              <div key={`new-image-${index}`} className="relative">
                <Image src={url} alt={`New Image ${index + 1}`} width={200} height={200} />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  aria-label={`Remove new image ${index + 1}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Display Success or Error Messages */}
          {success && <div className="text-green-500">{success}</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pending}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {pending ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
