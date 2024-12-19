// src/app/(customerFacing)/homepage/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getAllCategories, getProductsByCategoryId } from "@/lib/getCategories";
import Image from "next/image";
import Link from "next/link";
import Services from "./_components/Services";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Dynamically import client components
const PrimarySlider = dynamic(() => import("./_components/PrimarySlider"));
const CategoriesGridSlider = dynamic(
  () => import("./_components/CategoriesGridSlider")
);
const ReceipeSlider = dynamic(() => import("./_components/ReceipeSlider"));

interface HomepageProps {
  searchParams?: {
    indices?: string;
  };
}

export default async function Homepage({ searchParams }: HomepageProps) {
  // Fetch all categories
  const categories = await getAllCategories();
  // **For PrimarySlider, select categories**
 

  // Find the "Mixed Spices" category
  const mixedSpicesCategory = categories.find(
    (category) => category.name === "Mix Spices"
  );

  // **Fetch products in the "Mix Spices" category**
  let mixedSpicesProducts: Product[] = [];
  if (mixedSpicesCategory) {
    mixedSpicesProducts = await getProductsByCategoryId(mixedSpicesCategory.id);
  } else {
    // Handle the case where the category is not found
    mixedSpicesProducts = [];
  }
  
  // **For Other Sliders, select different categories**
  let CategoriesGridSliderIndices = [0, 2, 5, 6]; // Default indices for other sliders
  if (searchParams?.indices) {
    CategoriesGridSliderIndices = searchParams.indices
      .split(",")
      .map((str) => parseInt(str, 10))
      .filter((num) => !isNaN(num));
  }

  const filteredCatGridSlider =
    categories.length > 0
      ? CategoriesGridSliderIndices.map((index) => categories[index]).filter(
          Boolean
        )
      : [];

      const primarySliderIndices = [3, 4, 1]; // Adjust these indices as needed
      const primarySliderCategories = primarySliderIndices
        .map((index) => categories[index])
        .filter(Boolean);

  return (
    <div className="w-full mx-auto">
      {/* Pass categories as props */}
      <PrimarySlider categories={primarySliderCategories} />
      <div className="bg-slate-50 py-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Our Products</h1>
        </div>
        <div className="flex justify-end ml-auto mb-3">
          <Button className="outline-none text-xl"><Link href="/products" className="flex items-center space-x-2 hover:underline">View All Products</Link><ArrowRight className="w-4 h-4" /></Button>
          </div>
        {/* Categories Grid for Large Screens */}
        {filteredCatGridSlider.length > 0 && (
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {filteredCatGridSlider.map((category, index) => (
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
        {filteredCatGridSlider.length > 0 && (
          <div className="lg:hidden px-4">
            <CategoriesGridSlider categories={filteredCatGridSlider} />
          </div>
        )}
      </div>
      <div>
        <CardHeader>
          <CardTitle className="text-4xl text-center">Mixed Spices</CardTitle>
        </CardHeader>
        {/* Ensure mixedSpicesCategory is found before passing  */}
        {mixedSpicesCategory && (
          <ReceipeSlider
            products={mixedSpicesProducts}
            category={mixedSpicesCategory}
          />
        )}
      </div>
      <Services />
    </div>
  );
}
