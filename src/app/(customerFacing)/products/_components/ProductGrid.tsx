// components/ProductGrid.tsx
"use client"

import React, { useEffect, useState } from "react";
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
  category?: Category; // Made optional if needed
  expandedId?: string;   
};

const PRODUCTS_PER_PAGE = 20; // Update this to 5 if needed

const ProductsGrid: React.FC<ProductListProps> = ({ products, expandedId }) => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    setTotalPages(Math.ceil(products.length / PRODUCTS_PER_PAGE));
    // Reset to first page if products change
    setCurrentPage(1);
  }, [products]);

  const toggleProductDetails = (id: string) => {
    setExpandedProductId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (expandedId) {
      setExpandedProductId(expandedId);
    }
  }, [expandedId]);

  const handlePageChange = (page: number) => {
    // Ensure the new page is within bounds
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Generate page numbers (optional, for displaying page numbers)
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (products.length === 0) return <p>No Products Found</p>;

  return (
    <div>
      {/* Conditionally render category-specific UI if category is provided */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <React.Fragment key={product.id}>
            
            {/* Product Card */}
            <Card
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
                {/* Product Image */}
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={getImageSrc(product.images[0])}
                    alt={product.name}
                    fill
                    className="rounded-lg object-contain"
                    loading="lazy"
                    sizes="500" 
                  />
                </div>
                <CardTitle className="text-xl font-semibold truncate">{product.name}</CardTitle>
              </CardHeader>
            </Card>

            {/* Expandable Product Details */}
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
                  {/* Triangle Indicator */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <svg width="20" height="10" viewBox="0 0 20 10" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0L20 10H0L10 0Z" fill="white" />
                    </svg>
                  </div>
                  {/* Expanded Details Container */}
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <ProductDetails product={product} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))}
      </div>

       {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
    </div>
  );
};

export default ProductsGrid;
