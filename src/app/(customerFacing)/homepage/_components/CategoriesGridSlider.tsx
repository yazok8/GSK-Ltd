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
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '0px',
          arrows: true,
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto relative">
      {/* Adjust container padding based on screen size */}
      <div className="px-4 md:px-8">
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat.id} className="outline-none">
              {/* Adjust card padding and width */}
              <div className="px-1 sm:px-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 h-[16em] mx-auto">
                  <Link href={`/category/${cat.id}`}>
                    <div className="block">
                      {/* Image Container with consistent width */}
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
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
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
}

export default CategoriesGridSlider;