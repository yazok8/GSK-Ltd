// Homepage.tsx

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
import PartnersSections from "./_components/PartnersSections";

// Dynamically import client components
const PrimarySlider = dynamic(() => import("./_components/PrimarySlider"));
const CategoriesGridSlider = dynamic(
  () => import("./_components/CategoriesGridSlider")
);
const PetFoodSlider = dynamic(() => import("./_components/PetFoodSlider"));

interface HomepageProps {
  searchParams?: {
    indices?: string;
  };
}

export default async function Homepage({ searchParams }: HomepageProps) {
  // Fetch all categories
  const categories = await getAllCategories();

  // Find the "Pet Food" category
  const petFoodCategory = categories.find(
    (category) => category.name === "Pet Food"
  );

  // Fetch products in the "Pet Food" category
  let petFoodProducts: Product[] = [];
  if (petFoodCategory) {
    petFoodProducts = await getProductsByCategoryId(petFoodCategory.id);
  } else {
    petFoodProducts = [];
  }

  const numberOfVisibleCategories = 4;
  
  // Select indices for CategoriesGridSlider
  let CategoriesGridSliderIndices = [0, 2, 1, 7, 8]; // Ensure this includes all categories or adjust as needed
  if (searchParams?.indices) {
    CategoriesGridSliderIndices = searchParams.indices
      .split(",")
      .map((str) => parseInt(str, 10))
      .filter((num) => !isNaN(num));
  }

  const filteredCatGridSlider = categories; 

   
  
  const primarySliderIndices = [8, 4, 6, 5]; // Adjust these indices as needed
  const primarySliderCategories = primarySliderIndices
    .map((index) => categories[index])
    .filter(Boolean);

  return (
    <div className="w-full mx-auto">
      {/* Primary Slider */}
      <PrimarySlider categories={primarySliderCategories} />
      
      <div className="bg-slate-50 py-8 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold">Our Products</h1>
        </div>
        
        <div className="flex justify-end ml-auto mb-3">
          <Button className="outline-none text-xl">
            <Link href="/products" className="flex items-center space-x-2 hover:underline">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        {/* Categories Slider for All Screens */}
        {filteredCatGridSlider.length > 0 && (
          <div className="px-4">
            <CategoriesGridSlider categories={filteredCatGridSlider} />
          </div>
        )}
      </div>
      
      {/* Pet Food Section */}
      <div>
        <CardHeader>
          <CardTitle className="text-4xl text-center">Pet Food</CardTitle>
        </CardHeader>
        {petFoodCategory && (
          <PetFoodSlider
            products={petFoodProducts}
            category={petFoodCategory}
          />
        )}
      </div>
      
      {/* Additional Sections */}
      <Services />
      <PartnersSections />
    </div>
  );
}
