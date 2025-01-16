// components/ProductDetails.tsx
"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getImageSrc } from "@/lib/imageHelper";
import { MappedProduct } from "@/types/MappedProduct";

export type ProductProps = {
  product: MappedProduct;
};

const HorizontalLine = () => {
  return <hr className="w-full my-2 border-gray-300" />;
};

const ProductDetails: React.FC<ProductProps> = ({ product }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start gap-4 mt-8">
        {/* Product Image Section */}
        <div className="w-full md:w-1/3 relative h-64 rounded-lg overflow-hidden hidden md:flex md:flex-col">
          <Image
            src={getImageSrc(product.images[0])}
            alt={product.name}
            className="rounded-lg object-contain"
            loading="lazy"
            fill
            sizes="500"
          />
        </div>

        {/* Product Information */}
        <div className="w-full md:w-2/3">
          <Card className="border-none">
            <CardHeader className="text-start p-0">
              <CardTitle className="text-4xl font-bold text-start">{product.name}</CardTitle>
            </CardHeader>

            <HorizontalLine />

            <CardDescription className="text-start font-semibold text-xl">
              {product.description}
            </CardDescription>

            <HorizontalLine />

            {/* Display the category name instead of the entire object */}
            <div className="mt-2 text-start">
              <span className="font-semibold">Category:</span>{" "}
              {product.category?.name || "Uncategorized"}
            </div>
          </Card>
        </div>
      </div>
      <hr className="mt-4 mb-2 mx-8 border-2 border-solid border-teal-100" />
    </>
  );
};

export default ProductDetails;
