"use client";

import React from "react";
import { Category, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight } from "lucide-react";
import { getImageSrc } from "@/lib/imageHelper";
import ImageErrorBoundary from "@/components/error-boundaries/ImageErrorBoundary";

export type PetFoodSliderProps = {
  products: Product[];
  category: Category;
};

function PetFoodSlider({ products, category }: PetFoodSliderProps) {
  const searchParams = useSearchParams();
  
  // Create URL params without router
  const createProductUrl = (productId: string) => {
    const params = new URLSearchParams();
    
    // Add current page
    params.set('page', searchParams.get('page') || '1');
    
    // Add expanded product ID
    params.set('expandedId', productId);
    
    // Add any existing category filters
    const categoryIds = searchParams.get('categoryIds');
    if (categoryIds) {
      params.set('categoryIds', categoryIds);
    }

    return `/products?${params.toString()}`;
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    arrows: false,
  };

  return (
    <div className="mx-auto bg-teal-500 md:pt-2 md:py-8">
      <div className="hidden md:flex justify-end mb-3">
        <Button className="outline-none text-xl">
          <Link
            href={`/category/${category.id}`}
            className="flex items-center space-x-2 text-white hover:underline font-semibold"
          >
            View All {category.name}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Slider {...settings} className="lg:max-w-[1920px] mx-auto lg:pl-16">
        {products.map((product) => (
          <div key={product.id} className="lg:h-[700px]">
            <div className="flex flex-col md:flex-row h-full">
              <ImageErrorBoundary>
                <div className="relative w-full md:w-[600px] h-[500px] lg:h-full">
                  <Image
                    src={getImageSrc(product.images?.[0])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="600px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/fallback.jpg";
                      console.error(`Failed to load image for product ${product.name}. Using fallback image.`);
                    }}
                    onLoadingComplete={(image) => {
                      image.classList.remove('opacity-0');
                      image.classList.add('opacity-100');
                    }}
                  />
                </div>
              </ImageErrorBoundary>
              <div className="md:hidden flex justify-end mb-3">
                <Button className="outline-none text-xl">
                  <Link
                    href={`/category/${category.id}`}
                    className="flex items-center space-x-2 text-white hover:underline"
                  >
                    View All {category.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="py-4 flex flex-col mr-auto justify-center bg-teal-500 lg:h-full px-5 md:max-w-[50%]">
                <h2 className="text-2xl text-start font-semibold text-white mb-8">
                  {product.name}
                </h2>
                <p className="text-lg text-white">{product.description}</p>
                <Button className="mt-5 justify-center flex p-0 bg-teal-100 w-[150px] mx-auto">
                  <Link
                    href={createProductUrl(product.id)}
                    className="text-lg flex justify-center items-center font-semibold text-teal-600 border-b-4 border-teal-600 hover:text-teal-500 transition-colors duration-200 hover:underline w-full h-full px-4 py-2"
                  >
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default PetFoodSlider;
