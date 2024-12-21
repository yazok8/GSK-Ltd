import React from 'react';
import Image from 'next/image';
import { getImageSrc } from '@/lib/imageHelper';
import Link from 'next/link';
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

  console.log(products);

  return (
    <div className='container mx-auto px-4 py-8 flex flex-col justify-center text-center'>
      <div>
        <h1 className='text-3xl font-bold mb-10'>{category.name}</h1>
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4'>
          {products && products.map((product) => (
            <div key={product.id} className='flex flex-col justify-center items-center max-h-[300px] hover:underline'>
              <Link href={`/products/${product.id}`}>
                <Image
                  src={getImageSrc(product.images[0])}
                  alt={product.name}
                  width={250}
                  height={100}
                  className='mb-5 object-contain'
                  loading='lazy'
                  quality={80}
                />
                <h1>{product.name}</h1>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Component (Optional) */}
        {/* Implement pagination if needed */}
      </div>
    </div>
  );
}
