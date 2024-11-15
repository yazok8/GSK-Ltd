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
            const filteredData = [data[0], data[2], data[3], data[6]];
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
    <div className='bg-slate-50 py-8 max-w-6xl mx-auto'>
      {/* Section Header */}
      <div className='text-center pb-6'>
        <h1 className='text-5xl font-bold'>Our Products</h1>
      </div>
      
      {/* Categories Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4'>
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105"
          >
            <Link href={`/category/${category.id}`}>
              <div className='block'>
                {/* Image Container */}
                <div className='w-full h-48 relative'>
                  <Image 
                    src={category.image ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}` : '/images/fallback.jpg'} 
                    alt={category.name} 
                    layout='fill' 
                    objectFit='contain' 
                    className="hover:opacity-90"
                  />
                </div>
                
                {/* Category Name */}
                <div className='p-4 text-center'>
                  <h2 className='text-xl font-semibold'>{category.name}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </>

  );
}
