// src/app/admin/components/ProductForm.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageSrc } from '@/lib/imageHelper';
import { Prisma, Category } from '@prisma/client';
import { formatPrice } from '../../../../../utils/formatPrice';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

type ExistingImageState = {
  id: string;
  image: string;
  isRemoved: boolean;
  replacementFile?: File;
  replacementPreviewUrl?: string;
};

export default function ProductForm({
  product,
}: {
  product: ProductWithImages | null;
}) {
  // State for existing images
  const [existingImages, setExistingImages] = useState<ExistingImageState[]>(
    () =>
      product?.images.map((img) => ({
        id: img.id,
        image: img.image,
        isRemoved: false,
      })) || []
  );

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
  // Set initial image sources for existing images
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const imageUrls = product.images.map((img) => getImageSrc(img.image));
      setExistingImages((prevImages) =>
        prevImages.map((img, index) => ({
          ...img,
          replacementPreviewUrl: imageUrls[index],
        }))
      );
    }
  }, [product]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      existingImages.forEach((img) => {
        if (img.replacementPreviewUrl) {
          URL.revokeObjectURL(img.replacementPreviewUrl);
        }
      });
    };
  }, [newImagePreviews, existingImages]);

  /**
   * Handles changes to new image inputs.
   * @param e - The change event from the file input.
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
   * @param imageId - The ID of the image to remove.
   */
  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, isRemoved: !img.isRemoved } : img
      )
    );
  };

  /**
   * Handles replacing an existing image.
   * @param e - The change event from the file input.
   * @param imageId - The ID of the image to replace.
   */
  const handleReplaceExistingImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageId: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      setExistingImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId
            ? { ...img, replacementFile: file, replacementPreviewUrl: previewUrl }
            : img
        )
      );
    }
  };

  /**
   * Handles removing a new image before submission.
   * @param index - The index of the new image to remove.
   */
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setNewImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  /**
   * Handles form submission.
   * @param e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    try {
      // Append new images to formData
      newImages.forEach((file) => {
        formData.append('newImages', file);
      });

      // Append images to remove to formData
      const imagesToRemove = existingImages
        .filter((img) => img.isRemoved)
        .map((img) => img.id);
      imagesToRemove.forEach((id) => {
        formData.append('imagesToRemove', id);
      });

      // Append replacement images and their IDs
      existingImages.forEach((img) => {
        if (img.replacementFile && !img.isRemoved) {
          formData.append('replacementImages', img.replacementFile);
          formData.append('replacementImageIds', img.id);
        }
      });

      // Append other form fields as needed
      // Example: formData.append('name', name);

      // Append productId if editing
      if (product) {
        formData.append('productId', product.id);
      }

      // Send the form data to the server
      const response = await fetch('/api/products/addProduct', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Product updated successfully!');
        // Optionally, reset the form or redirect
      } else {
        const errorData = await response.json();
        setError(errorData.errors?.general?.[0] || 'An error occurred.');
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add A Product</CardTitle>
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
              {formatPrice(price ? price / 100 : 0)}
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
              name="categoryId" // Ensure this matches the server-side expectation
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="" className="text-sm">Select a category</option>
              {categories &&categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Images */}
          <div className="space-y-2">
            <Label htmlFor="new-images">Add New Images</Label>
            <Input
              type="file"
              id="new-images"
              name="newImages" // Ensure the name matches the backend expectation
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

          {/* Existing Images */}
          <div className="space-y-2">
            <Label>Existing Images</Label>
            {existingImages.map((imgState, index) => (
              <div key={imgState.id} className="relative">
                <Image
                  src={imgState.replacementPreviewUrl || getImageSrc(imgState.image)}
                  alt={`Existing Image ${index + 1}`}
                  width={200}
                  height={200}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imgState.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-md"
                  aria-label={`Remove existing image ${index + 1}`}
                >
                  {imgState.isRemoved ? 'Undo Remove' : 'Remove'}
                </button>
                {!imgState.isRemoved && (
                  <>
                    <Label htmlFor={`replace-image-${imgState.id}`}>Replace Image</Label>
                    <Input
                      type="file"
                      id={`replace-image-${imgState.id}`}
                      name={`replacementImages[${index}]`} // Ensure unique naming
                      accept="image/*"
                      onChange={(e) => handleReplaceExistingImage(e, imgState.id)}
                    />
                  </>
                )}
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
