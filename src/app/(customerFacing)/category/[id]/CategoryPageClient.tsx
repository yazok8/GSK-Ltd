// components/CategoryPageClient.tsx

import React from 'react';
import { getImageSrc } from '@/lib/imageHelper';
import { Category } from '@prisma/client';
import Image from 'next/image';
import ProductsGrid from '../../products/_components/ProductGrid';
import { MappedProduct } from '@/types/MappedProduct';

interface CategoryPageClientProps {
  category: Category;
  products: MappedProduct[];
}

export default function CategoryPageClient({ category, products }: CategoryPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center text-center">
      {/* Category Header */}
      <div className='flex flex-col justify-center mx-auto my-10'>
        <h1 className="text-3xl font-bold mb-10">{category.name}</h1>
        <div className="relative w-full rounded-lg overflow-hidden">
          <Image
            src={getImageSrc(category.image)}
            width={700}
            height={350}
            alt={category.name}
            quality={80}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      </div>

      {/* Render products using ProductGrid */}
      <ProductsGrid products={products} category={category} />
    </div>
  );
}
