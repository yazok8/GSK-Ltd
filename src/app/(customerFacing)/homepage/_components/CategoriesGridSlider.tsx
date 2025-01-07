"use client";

import React from "react";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export type CategoryProps = {
  categories: Category[];
};

function CategoriesGridSlider({ categories }: CategoryProps) {
  const settings = {
    dots: true,
    infinite: false, // Enable infinite scrolling if needed
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1022, // Medium screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Medium screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto relative">
      <Slider {...settings}>
        {categories.map((cat) => (
          <div key={cat.id} className="px-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 h-[16em]">
              <Link href={`/category/${cat.id}`}>
                <div className="block">
                  {/* Image Container */}
                  
                  <div className="w-full h-48 relative">
                    <Image
                      src={
                        cat.image
                          ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`
                          : "/images/fallback.jpg"
                      }
                      quality={80}
                      alt={cat.name}
                      fill
                      className="hover:opacity-90 object-contain"
                      loading="lazy"
                      sizes="500"
                    />
                  </div>

                  {/* Category Name */}
                  <div className="px-1 text-center">
                    <h2 className="text-xl font-semibold">{cat.name}</h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CategoriesGridSlider;
