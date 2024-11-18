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
  return <hr className="w-[30%] my-2" />;
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
    <div className="flex flex-col items-start h-full md:flex-row pt-7">
      <div className="aspect-video flex-shrink-0 relative justify-start">
        <ProductImage
          product={product}
          selectedImg={productDetail.selectedImg}
          handleImageSelect={handleImageSelect}
        />
      </div>
      <div className="aspect-video flex-shrink-0 relative justify-end md:w-1/2 -ml-[100px]">
        <Image
          className="flex justify-center items-center object-contain object-center"
          src={getImageSrc(productDetail.selectedImg.image)}
          fill
          alt={product.name}
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback-image.png";
          }}
        />
      </div>

      <Card className="flex flex-col border-none">
        <CardHeader className="text-lg flex">
          <CardTitle className="text-2xl font-bold p-0">{product.name}</CardTitle>
        </CardHeader>

        <HorizontalLine />
        <CardDescription className="text-muted-foreground sm:pr-0">
          {product.description}
        </CardDescription>
        <HorizontalLine />
        <div className="flex flex-col">
          <span className="text-slate-500 font-semibold">Category: {product.category}</span>
        </div>
        <HorizontalLine />
        <div className="space-y-3 mt-5"></div>
      </Card>
    </div>
  );
}
