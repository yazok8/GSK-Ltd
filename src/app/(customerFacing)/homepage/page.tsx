// src/app/(customerFacing)/homepage/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { getAllCategoriesWithImages } from '../actions/categories';
import PrimarySlider from './_components/PrimarySlider';
import CategoriesGridSection from './_components/CategoriesGridSection';
import { CategoryWithImage } from '@/types/Category';
import { Category } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export default function Homepage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories once the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          if(data.length > 0){
            const filteredData = [data[0], data[3], data[6]];
            setCategories(filteredData);
          }
          console.error('Failed to fetch categories');
       
      }
    }catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  
  

  return (
    <>
      <PrimarySlider />
      <div className='bg-slate-100'>
      <div className='text-center pt-5 pb-3'>
        <h1 className='text-5xl'>Our Products</h1>
      </div>
      <div className='flex flex-wrap gap-4 p-4 justify-center'>
        {categories.map((category) => (
          <div key={category.id} className="bg-white">
            <div className='text-center'>
              
            <div className='min-h-[200px] flex px-3'>
             <Image src={`https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`} width={300} height={300} alt="category.name" />
             </div>
             <h1 className='text-xl py-6'> {category.name}</h1>
            </div>
            
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
