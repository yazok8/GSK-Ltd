// Optimized CategoriesGridSlider Component
"use client";

import React, { memo } from "react";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export type CategoryProps = {
  categories: Category[];
};

const CategoriesGridSlider = memo(({ categories }: CategoryProps) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { 
        breakpoint: 640, 
        settings: { 
          slidesToShow: 1, 
          centerMode: true, 
          centerPadding: '0px' 
        } 
      }
    ]
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto relative">
      <div className="px-4 md:px-8">
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat.id} className="outline-none">
              <div className="px-1 sm:px-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 h-[16em] mx-auto">
                  <Link href={`/category/${cat.id}`}>
                    <div className="block">
                      <div className="w-full h-48 relative">
                        <Image
                          src={
                            cat.image
                              ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`
                              : "/images/fallback.jpg"
                          }
                          quality={70}
                          alt={cat.name}
                          fill
                          className="hover:opacity-90 object-contain"
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-1 text-center">
                        <h2 className="text-xl font-semibold">{cat.name}</h2>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
});

CategoriesGridSlider.displayName = 'CategoriesGridSlider';

export default CategoriesGridSlider;