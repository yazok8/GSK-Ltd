// components/ProductDetails.tsx

"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/imageHelper";
import { MappedProduct } from "@/types/MappedProduct";
import { Category } from "@prisma/client";

export type ProductProps = {
  product: MappedProduct;
  category: Category;
};

export type SelectedImgType = {
  image: string;
};

export type ProductDetailType = {
  id: string;
  name: string;
  description: string;
  category: string;
  selectedImg: SelectedImgType;
};

const HorizontalLine = () => {
  return <hr className="w-full my-2 border-gray-300" />;
};


const ProductDetails: React.FC<ProductProps> = ({ product, category }) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
      {/* Product Image Section */}
      <div className="w-full md:w-1/3 relative h-64 rounded-lg overflow-hidden">
        <Image
          src={getImageSrc(product.images[0])}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Product Information */}
      <div className="w-full md:w-2/3">
        <Card className="border-none">
          <CardHeader className="text-start p-0">
            <CardTitle className="text-2xl font-bold text-start">{product.name}</CardTitle>
          </CardHeader>

          <HorizontalLine />

          <CardDescription className="text-gray-700 text-start">
            {product.description}
          </CardDescription>

          <HorizontalLine />

          {/* Displaying Category from prop */}
          <div className="mt-2 text-start">
            <span className="font-semibold">Category:</span> {category?.name || 'Uncategorized'}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;

