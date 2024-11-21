// src/app/(customerFacing)/homepage/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getCategories } from "@/lib/getCategories";
import PrimarySlider from "./_components/PrimarySlider";
import Image from "next/image";
import Link from "next/link";
import Services from "./_components/Services";
import { CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import client components
const CategoriesGridSlider = dynamic(
  () => import("./_components/CategoriesGridSlider"),
  { ssr: false }
);
const ReceipeSlider = dynamic(() => import("./_components/ReceipeSlider"), {
  ssr: false,
});

interface HomepageProps {
  searchParams?: {
    indices?: string;
  };
}

export default async function Homepage({ searchParams }: HomepageProps) {
  let indices = [2, 3, 5, 7]; // Default indices

  if (searchParams?.indices) {
    indices = searchParams.indices
      .split(",")
      .map((str) => parseInt(str, 10))
      .filter((num) => !isNaN(num));
  }

  // Use the helper function to fetch categories
  const { categories, filteredCategories } = await getCategories(indices);

  return (
    <>
      {/* Pass categories as props */}
      <PrimarySlider categories={categories} />
      <div className="bg-slate-50 py-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Our Products</h1>
        </div>

        {/* Categories Grid for Large Screens */}
        {filteredCategories.length > 0 && (
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {filteredCategories.map((category, index) => (
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
        {filteredCategories.length > 0 && (
          <div className="lg:hidden px-4">
            <CategoriesGridSlider categories={filteredCategories} />
          </div>
        )}
      </div>
      <div>
      <CardHeader>
        <CardTitle className="text-4xl text-center">Mixed Spices</CardTitle>
      </CardHeader>
        <ReceipeSlider categories={filteredCategories} />
      </div>
      <Services/>
    </>
  );
}
