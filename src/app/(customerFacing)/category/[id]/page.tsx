// pages/category/[id].tsx or similar path

import React from 'react';
import { MappedProduct } from '@/types/MappedProduct';
import CategoryPageClient from './CategoryPageClient';
import { isValidObjectId } from '@/lib/validateObjectId';  // Utility function to validate ObjectID
import { getCategoryById, getProductsByCategoryPaginated } from '../../actions/categories';

type CategoryPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
  };
};

const PRODUCTS_PER_PAGE = 6;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = params;
  const page = parseInt(searchParams.page || '1', 10);

  // Validate ObjectID
  if (!isValidObjectId(id)) {
    return <div className="text-red-500">Invalid category ID.</div>;
  }

  // Fetch category details
  const category = await getCategoryById(id);

  if (!category) {
    return <div className="text-red-500">Category not found.</div>;
  }

  const { products, total } = await getProductsByCategoryPaginated(id, page, PRODUCTS_PER_PAGE);

  const totalPage = Math.ceil(total / PRODUCTS_PER_PAGE);

  // Map fetched products to MappedProduct type
  const mappedProducts: MappedProduct[] = products.map((product) => ({
    id: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    category: category.name, // Assigning category name
    price: product.price,
    inStock: product.inStock,
    brand: product.brand,
  }));

  return (
    <CategoryPageClient 
      category={category}
      products={mappedProducts} />
  );
}
