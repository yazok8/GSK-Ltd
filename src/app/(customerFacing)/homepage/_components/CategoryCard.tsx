// components/CategoryCard.tsx

import React from "react";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
  isSlider?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSlider = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 ${isSlider ? "bg-teal-500 text-white" : "bg-white text-black"}`}>
      <Link href={`/category/${category.id}`}>
        <div className="block">
          {/* Image Container */}
          <div className={`w-full h-48 relative ${isSlider ? "bg-teal-500" : ""}`}>
            <Image
              src={
                category.image
                  ? `https://gsk-ltd.s3.us-east-2.amazonaws.com/${category.image}`
                  : "/images/fallback.jpg"
              }
              quality={80}
              alt={category.name}
              fill
              style={{ objectFit: "cover" }}
              className="hover:opacity-90"
              loading="lazy"
            />
          </div>

          {/* Category Name */}
          <div className={`p-4 text-center ${isSlider ? "bg-teal-500" : ""}`}>
            <h2 className="text-xl font-semibold">{category.name}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
