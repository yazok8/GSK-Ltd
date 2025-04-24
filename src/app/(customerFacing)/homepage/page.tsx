import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { getAllCategories, getProductsByCategoryId } from "@/lib/getCategories";
import Link from "next/link";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Services = dynamic(() => import("./_components/Services"), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse"></div>
});

const PrimarySlider = dynamic(() => import("./_components/PrimarySlider"), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-200 animate-pulse"></div>
});

const CategoriesGridSlider = dynamic(() => import("./_components/CategoriesGridSlider"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse"></div>
});

const PetFoodSlider = dynamic(() => import("./_components/PetFoodSlider"), {
  ssr: false,
  loading: () => <div className="h-[700px] bg-gray-200 animate-pulse"></div>
});

const PartnersSections = dynamic(() => import("./_components/PartnersSections"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse"></div>
});


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

   
  
  const primarySliderIndices = [4, 1, 5]; 
  const primarySliderCategories = primarySliderIndices
    .map((index) => categories[index])
    .filter(Boolean);

    const categoriesGridSlider = categories.slice(0, 9);

    return (
      <div className="w-full mx-auto">
        <Suspense fallback={<div className="h-[500px] bg-gray-200 animate-pulse"></div>}>
          <PrimarySlider categories={primarySliderCategories} />
        </Suspense>
        
        <div className="bg-slate-50 py-8 max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold">Our Products</h1>
          </div>
          
          <div className="flex justify-end ml-auto mb-3">
            <Button asChild variant="outline">
              <Link href="/products" className="flex items-center space-x-2">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
            <CategoriesGridSlider categories={categoriesGridSlider} />
          </Suspense>
        </div>
        
        {petFoodCategory && (
          <Suspense fallback={<div className="h-[700px] bg-gray-200 animate-pulse"></div>}>
            <PetFoodSlider
              products={petFoodProducts}
              category={petFoodCategory}
            />
          </Suspense>
        )}
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse"></div>}>
          <Services />
        </Suspense>
        
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse"></div>}>
          <PartnersSections />
        </Suspense>
      </div>
    );
}
