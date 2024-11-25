// components/ReceipeSlider.tsx
"use client";

import React from "react";
import { Category, Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight } from "lucide-react";

export type ReceipeSliderProps = {
  products: Product[];
  category: Category;
};

function ReceipeSlider({ products,category }: ReceipeSliderProps) {
  const settings = {
    dots: true,
    infinite: false, // Set to true if you want infinite scrolling
    speed: 500,
    slidesToShow: 1, // Show up to 4 slides
    slidesToScroll: 1,
    adaptiveHeight: false,
    arrows: true,
  };

  return (
    <div className="w-full mx-auto relative bg-teal-500 md:pt-2 md:pl-2 md:py-8">
         <div className="flex justify-end mb-3">
        <Button className="outline-none text-xl">
          <Link href={`/category/${category.id}`} className="flex items-center space-x-2 text-white hover:underline">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="lg:h-[700px]">
            <div className="flex flex-col md:flex-row h-full lg:ml-[160px]">
              {/* Image Container */}
              <div className="relative w-full md:w-[600px] h-[500px] lg:h-full">
                <Image
                  src={
                    product.images && product.images.length > 0
                      ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${product.images[0]}`
                      : "/images/fallback.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              {/* Product Details */}
              <div className="p-4 flex flex-col mr-auto justify-center bg-teal-500 lg:h-full pl-10">
                <h2 className="text-2xl text-start font-semibold text-white mb-8">
                  {product.name}
                </h2>
                <p className="text-lg text-white">
                  {product.description}
                </p>
                <Button className="mt-5">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-lg font-semibold text-blue-600 border-b-4 border-blue-500 hover:text-blue-800 transition-colors duration-200 hover:underline"
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

export default ReceipeSlider;
