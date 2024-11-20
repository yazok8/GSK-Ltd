// components/ReceipeSlider.tsx
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

function ReceipeSlider({ categories }: CategoryProps) {
  const settings = {
    dots: true,
    infinite: false, // Set to true if you want infinite scrolling
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false, // We are setting explicit heights
    arrows:false
  };

  return (
    <div className="w-full mx-auto relative bg-teal-500 lg:ml-[160px] md:pt-2 md:pl-2">
      <Slider {...settings}>
        {categories.map((cat) => (
          <div key={cat.id} className="lg:h-[700px]">
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Container */}
              <div className="relative w-full md:w-[600px] h-[500px] lg:h-full">
                <Link href={`/category/${cat.id}`}>
                  <Image
                    src={
                      cat.image
                        ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${cat.image}`
                        : "/images/fallback.jpg"
                    }
                    alt={cat.name}
                    object-fi='cover'
                    fill
                    className="h-full w-full"
                    loading="lazy"
                  />
                </Link>
              </div>
              {/* Category Name */}
              <div className="p-4 flex items-center justify-center bg-teal-500 lg:h-full">
                <h2 className="text-2xl font-semibold text-white">
                  {cat.name}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ReceipeSlider;
