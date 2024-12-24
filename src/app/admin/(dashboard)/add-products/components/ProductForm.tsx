"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageSrc } from '@/lib/imageHelper';
import { Prisma, Category } from '@prisma/client';
import { formatPrice } from '../../../../../../utils/formatPrice';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation'; // Updated import

type Product = Prisma.ProductGetPayload<object>;

interface ProductFormProps {
  product: Product | null;
  session?: any; // Adjust if you have a custom Session type
}

export default function ProductForm({ product, session }: ProductFormProps) {
  const router = useRouter();

    // Check if user is VIEW_ONLY
    const isViewOnly = session?.user?.role === "VIEW_ONLY";

  // State for form fields
  const [name, setName] = useState<string>(product?.name || "");
  const [price, setPrice] = useState<string>(product?.price?.toString() || "");
  const [description, setDescription] = useState<string>(product?.description || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product?.categoryId || ""
  );

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

  const [categories, setCategories] = useState<Category[]>([]);
  const [pending, setPending] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Optional: Prevent state reset if product prop changes after submission
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (product && !hasSubmitted) {
      setName(product.name);
      setPrice(product.price?.toString() || '');
      setDescription(product.description);
      setSelectedCategory(product.categoryId || "");
      setExistingImages(product.images || []);
    }
  }, [product, hasSubmitted]);

  if (isViewOnly && !product) {
    return <p className='flex justify-center'>You do not have permission to add new products.</p>;
  }


  if (isViewOnly && product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Details (Read-only)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {product.name}
            </p>
            <p>
              <strong>Price:</strong> {formatPrice(product.price || 0)}
            </p>
            <p>
              <strong>Description:</strong> {product.description}
            </p>

            {product.images?.length > 0 && (
              <div>
                <strong>Images:</strong>
                <div className="flex space-x-2 mt-2">
                  {product.images.map((imgKey, idx) => (
                    <div key={idx}>
                      <Image
                        src={getImageSrc(imgKey)}
                        alt={`Image ${idx + 1}`}
                        width={150}
                        height={150}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

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

    const formData = new FormData();

    try {
      // Append form fields
      formData.append('name', name);
      formData.append('price', price || '0');
      formData.append('description', description);
      formData.append('categoryId', selectedCategory);

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

        // Reset all form fields
        setName('');
        setPrice('');
        setDescription('');
        setSelectedCategory('');
        setExistingImages([]);
        setImagesToRemove([]);
        setNewImages([]);
        setNewImagePreviews([]);
        setHasSubmitted(true);

        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="text-muted-foreground">
              {formatPrice(Number(price) || 0)}
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              name="newImages"
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
              ref={fileInputRef}
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
