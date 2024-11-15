// src/app/(customerFacing)/components/Homepage/_components/CategoriesGridSection.tsx

"use client";

import { CategoryWithImage } from '@/types/Category';
import React from 'react';
import CategoryCard from './CategoryCard';

type CategoriesGridSectionProps = {
  title: string;
  image: string;
  description: string | null;
  categoryId: string;
};

export default function CategoriesGridSection({
  title,
  image,
  description,
  categoryId,
}: CategoriesGridSectionProps) {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>{title}</h2>
      {description && <p className='text-sm text-gray-600'>{description}</p>}
      <CategoryCard
        id={categoryId}
        name={title}
        description={description ?? 'No description available.'}
        image={image}
      />
    </div>
  );
}
