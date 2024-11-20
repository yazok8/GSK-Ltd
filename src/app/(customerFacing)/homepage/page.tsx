// src/app/(customerFacing)/homepage/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PrimarySlider from "./_components/PrimarySlider";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import CategoriesGridSlider from "./_components/CategoriesGridSlider";
import ReceipeSlider from "./_components/ReceipeSlider";

export default function Homepage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 due to prepended clone


  useEffect(() => {
    // Fetch categories once the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data: Category[] = await response.json();
          if (data.length > 0) {
            const filteredData = [data[2], data[3], data[5], data[7]];
            setCategories(filteredData);
            setCurrentIndex(1); // Start at first real slide
          }
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

 

  if (categories.length <= 2) {
    return <div>Loading...</div>;
  }

  const currentCategory = categories[currentIndex];

  return (
    <>
      <PrimarySlider />
      <div className="bg-slate-50 py-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Our Products</h1>
        </div>

        {/* Categories Grid for Large Screens */}
        {categories.length > 0 && (
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {categories.map((category,index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105"
              >
                <Link href={`/category/${category.id}`}>
                  <div className="block">
                    {/* Image Container */}
                    <div className="w-full h-48 relative">
                      <Image
                        src={
                          category.image
                            ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`
                            : "/images/fallback.jpg"
                        }
                        quality={80}
                        alt={category.name}
                        fill
                        style={{ objectFit: "contain" }}
                        className="hover:opacity-90"
                        loading="lazy"
                      />
                    </div>

                    {/* Category Name */}
                    <div className="p-4 text-center">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Categories Slider for Small and Medium Screens */}
        {categories.length > 0 && (
          <div className="lg:hidden px-4">
            <CategoriesGridSlider categories={categories}/>
          </div>
        )}
      </div>
      <div className="bg-teal-500">
      <ReceipeSlider categories={categories}/>
      </div>
    </>
  );
}