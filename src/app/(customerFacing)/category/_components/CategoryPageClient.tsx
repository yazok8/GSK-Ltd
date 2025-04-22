// components/CategoryPageClient.tsx

"use client";

import React from 'react';
import { getImageSrc } from '@/lib/imageHelper';
import { Category } from '@prisma/client';
import Image from 'next/image';
import ProductsGrid from '../../products/_components/ProductGrid';
import { MappedProduct } from '@/types/MappedProduct';

export interface CategoryPageClientProps {
  category: Category;
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
}

export default function CategoryPageClient({ category, products, currentPage, totalPages }: CategoryPageClientProps) {
  const categoryImage = category.image ? getImageSrc(category.image) : '/default-category-image.png';
  const baseUrl = `/category/${category.id}`; // Corrected baseUrl

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center text-center">
      {/* Category Header */}
      <div className='flex flex-col justify-center mx-auto my-10'>
        <h1 className="text-3xl font-bold mb-10">{category.name}</h1>
        <div className="relative w-full rounded-lg overflow-hidden">
          <Image
            src={categoryImage}
            width={700}
            height={350}
            alt={category.name}
            quality={80}
          />
        </div>
      </div>

      {/* Render products using ProductGrid */}
      <ProductsGrid 
        products={products} 
        category={category} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        baseUrl={baseUrl} 
      />
    </div>
  );
  
}
