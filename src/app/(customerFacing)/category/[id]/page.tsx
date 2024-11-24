// src/app/(customerFacing)/category/[id]/page.tsx

import React from 'react';
import { getCategoryById, getProductsByCategoryPaginated } from "../../actions/categories";
import Image from 'next/image';
import { getImageSrc } from '@/lib/imageHelper';
import Link from 'next/link';
import { isValidObjectId } from '@/lib/validateObjectId';  // Utility function to validate ObjectID

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

  console.log(products);

  return (
    <>
    <h1 className='text-3xl font-bold my-10'>{category.name}</h1>
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products && products.map((product) => (
            <div key={product.id} className="flex flex-col items-center mt-6 p-2 bg-transparent">
              <Link href={`/products/${product.id}`}>
              <div
                className="w-72 h-52 sm:w-72 sm:h-60 relative mb-3 cursor-pointer">
                <Image
                  src={getImageSrc(product.images[0])}
                  alt={product.name}
                 fill
                  className="object-cover rounded-md -z-10"
                  loading='lazy'
                  quality={80}
                />
              </div>
                <h1 className="text-center text-base sm:text-lg font-medium underline">{product.name}</h1>
              </Link>
            </div>
          ))}
      

        {/* Pagination Component (Optional) */}
        {/* Implement pagination if needed */}
    </div>
    </>
  );
}
