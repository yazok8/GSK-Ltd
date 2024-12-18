"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductImage from "./ProductImage";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/imageHelper";

export type ProductProps = {
  product: {
    id: string;
    images: string[];
    name: string;
    description: string;
    category: string;
  };
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
  return <hr className="w-[20%] my-1" />;
};

export default function ProductDetails({ product }: ProductProps) {
  const [selectedImg, setSelectedImg] = useState<SelectedImgType>({ image: product.images[0] });
  const [productDetail, setProductDetail] = useState<ProductDetailType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    selectedImg: { image: product.images[0] },
  });

  const handleImageSelect = useCallback((value: SelectedImgType) => {
    setProductDetail((prev) => ({ ...prev, selectedImg: value }));
  }, []);

  useEffect(() => {
    console.log(product.images);
  }, [product.images]);

  return (
    <div className="flex flex-col md:flex-row items-start h-full pt-7 overflow-hidden gap-2">
      {/* Product Image Section */}
      <div className="w-full md:w-1/5 relative">
        <ProductImage
          product={product}
          selectedImg={productDetail.selectedImg}
          handleImageSelect={handleImageSelect}
        />
      </div>

      {/* Additional Image Section */}
      <div className="relative w-full md:w-1/2 lg:w-1/3 h-auto hidden md:block -ml-20">
        <Image
          className="object-contain rounded-lg"
          src={getImageSrc(productDetail.selectedImg.image)}
          width={500}
          height={500}
          alt={product.name}
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback-image.png";
          }}
        />
      </div>

      {/* Product Details Card */}
      <Card className="flex flex-col border-none mt-4 md:mt-0 ml-1 flex-grow">
        <CardHeader className="text-lg flex pl-1">
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        </CardHeader>

        <HorizontalLine />
        <CardDescription className="text-muted-foreground pl-1">
          {product.description}
        </CardDescription>
        <HorizontalLine />
        <div className="flex flex-col">
          <CardDescription className=" text-muted-foreground font-semibold pl-1">Category: {product.category}</CardDescription>
        </div>
        <HorizontalLine />
        <div className="space-y-3 mt-5"></div>
      </Card>
    </div>
  );
}
