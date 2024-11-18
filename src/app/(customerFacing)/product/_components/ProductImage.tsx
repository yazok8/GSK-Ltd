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
    <div className="flex flex-row lg:flex-col md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2 md:w-1/3 space-y-24 md:space-y-3 ml-4">
        {product.images.map((image: string, index: number) => (
          <div
            key={index}
            onClick={() => handleImageSelect({ image })}
            className={`relative md:w-full md:h-auto cursor-pointer border max-h-0 md:max-h-16 ${
              selectedImg.image === image ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <Image
              src={getImageSrc(image)}
              alt={`Product Image ${index + 1}`}
              // layout="fill"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        ))}
      </div>
      {/* Main Image */}
      <div className="relative w-full md:w-4/5 h-80 md:h-auto md:hidden">
        <Image
          src={getImageSrc(selectedImg.image)}
          alt={product.name}
          layout="fill"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ProductImage;
