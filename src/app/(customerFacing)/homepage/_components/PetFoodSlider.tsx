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

function ReceipeSlider({ products, category }: ReceipeSliderProps) {
  const settings = {
    dots: true,
    infinite: false, // Set to true if you want infinite scrolling
    speed: 500,
    slidesToShow: 1, // Show up to 4 slides
    slidesToScroll: 1,
    adaptiveHeight: false,
    arrows: false,
  };

  return (
    <>
      <div className="mx-auto bg-teal-500 md:pt-2 md:py-8">
        <div className="hidden md:flex justify-end mb-3">
          <Button className="outline-none text-xl">
            <Link
              href={`/category/${category.id}`}
              className="flex items-center space-x-2 text-white hover:underline"
            >
              View All Pet Food
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <Slider {...settings} className="lg:max-w-[1920px] mx-auto lg:pl-16">
          {products.map((product) => (
            <div key={product.id} className="lg:h-[700px]">
              <div className="flex flex-col md:flex-row h-full">
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
                    sizes="600px" 
                  />
                </div>
                <div className="md:hidden flex justify-end mb-3">
                  <Button className="outline-none text-xl">
                    <Link
                      href={`/category/${category.id}`}
                      className="flex items-center space-x-2 text-white hover:underline"
                    >
                      View All Receipes
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                {/* Product Details */}
                <div className="py-4 flex flex-col mr-auto justify-center bg-teal-500 lg:h-full px-5 md:max-w-[50%]">
                  <h2 className="text-2xl text-start font-semibold text-white mb-8">
                    {product.name}
                  </h2>
                  <p className="text-lg text-white">{product.description}</p>
                  <Button className="mt-5 justify-center flex pl-0 bg-teal-100">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-lg font-semibold text-teal-600 border-b-4 border-teal-600 hover:text-teal-500 transition-colors duration-200 hover:underline"
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
    </>
  );
}

export default ReceipeSlider;
