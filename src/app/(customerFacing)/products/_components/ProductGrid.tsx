// components/products/_components/ProductGrid.tsx

"use client"

import React, { useState, useEffect } from "react";
import ProductDetails from "./ProductDetails";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MappedProduct } from "@/types/MappedProduct";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getImageSrc } from "@/lib/imageHelper";
import { Category } from "@prisma/client";
import { Pagination } from "@/components/ui/Pagination";

type ProductListProps = {
  products: MappedProduct[];
  category?: Category;
  expandedId?: string; 
  currentPage: number;
  totalPages: number;
  baseUrl: string;
};

const ProductsGrid: React.FC<ProductListProps> = ({ 
  products = [],
  expandedId, 
  currentPage = 1,
  totalPages = 1,
  baseUrl 
}) => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define the toggleProductDetails function
  const toggleProductDetails = (id: string) => {
    setExpandedProductId((prevId) => (prevId === id ? null : id));
    // Optionally, update URL here if needed
  };

  useEffect(() => {
    if (products) {
      setIsLoading(false);
    }
  }, [products]);

  useEffect(() => {
    if (expandedId) {
      setExpandedProductId(expandedId);
      // Optionally, scroll to the expanded product
      const element = document.getElementById(`product-card-${expandedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [expandedId]);

  if (isLoading) {
    return <div className="flex justify-center items-center">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-gray-600">No Products Found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <Card
              id={`product-card-${product.id}`}
              className={`cursor-pointer flex flex-col h-full transition-transform transform hover:scale-105 hover:shadow-lg ${
                expandedProductId === product.id ? "border-teal-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              onClick={() => toggleProductDetails(product.id)}
              role="button"
              aria-expanded={expandedProductId === product.id}
              aria-controls={`product-details-${product.id}`}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleProductDetails(product.id);
                }
              }}
            >
              <CardHeader className="flex-1">
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={getImageSrc(product.images?.[0])}
                    alt={product.name}
                    fill
                    className="rounded-lg object-contain"
                    loading="lazy"
                    sizes="500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/fallback-image.jpg';
                    }}
                  />
                </div>
                <CardTitle className="text-xl font-semibold truncate">{product.name}</CardTitle>
              </CardHeader>
            </Card>

            <AnimatePresence>
              {expandedProductId === product.id && (
                <motion.div
                  id={`product-details-${product.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full mt-2 overflow-hidden relative"
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0L20 10H0L10 0Z" fill="white" />
                    </svg>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <ProductDetails product={product} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={baseUrl}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
