"use client";

import { getImageSrc } from "@/lib/imageHelper";
import Image from "next/image";

interface ProductImageProps {
  product: {
    images: string[];
    name: string;
  };
  selectedImg: { image: string };
  handleImageSelect: (value: { image: string }) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({ product, selectedImg, handleImageSelect }) => {
  return (
    <div className="flex flex-row md:flex-row lg:flex-col gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 md:w-1/3 space-y-3 ml-4">
        {product.images.map((image: string, index: number) => (
          <div
            key={index}
            onClick={() => handleImageSelect({ image })}
            className={`relative cursor-pointer border ${
              selectedImg.image === image ? "border-blue-500" : "border-gray-300"
            } rounded-lg overflow-hidden`}
          >
            <Image
              src={getImageSrc(image)}
              alt={`Product Image ${index + 1}`}
              width={100}
              height={100}
              className="object-cover w-full h-full"
              // Removed placeholder and blurDataURL
            />
          </div>
        ))}
      </div>
      {/* Main Image */}
      <div className="relative w-[300px] h-80 md:hidden mr-20">
        <Image
          src={getImageSrc(selectedImg.image)}
          alt={`Selected Image of ${product.name}`}
          fill
          className="object-contain rounded-lg"
          loading="lazy"
          quality={80}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/fallback-image.png";
          }}
          // Removed blurDataURL
        />
      </div>
    </div>
  );
};

export default ProductImage;
