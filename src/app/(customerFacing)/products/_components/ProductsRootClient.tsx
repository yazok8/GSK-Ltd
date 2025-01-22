// components/products/_components/ProductsRootClient.tsx

"use client";

import React, { useState, useEffect } from "react";
import ProductsPageClient from "./ProductsPageClient";
import CategorySidebar from "./CategorySidebar";
import { MappedProduct } from "@/types/MappedProduct";
import { useRouter, useSearchParams } from "next/navigation";

interface RootClientProps {
  categories: { id: string; name: string }[];
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
}

export default function ProductsRootClient({
  categories,
  products,
  currentPage,
  totalPages,
}: RootClientProps) {
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = async (categoryIds: string[]) => {
    // Build the query string
    const query = new URLSearchParams();
    if (categoryIds.length > 0) {
      query.set("categoryIds", categoryIds.join(","));
    }
    // Reset to page 1 when category changes
    query.set("page", "1");

    // Navigate to the new URL with updated query parameters
    router.push(`/products?${query.toString()}`);
  };

  useEffect(() => {
    const categoryIds = searchParams.get("categoryIds")?.split(",") || [];
    const fetchFilteredProducts = async () => {
      if (categoryIds.length === 0) {
        setFilteredProducts(products);
        return;
      }
      const res = await fetch(
        `/api/products?categoryIds=${categoryIds.join(",")}&page=${currentPage}`
      );
      const data = await res.json();
      setFilteredProducts(data.products);
    };

    fetchFilteredProducts();
  }, [searchParams, products, currentPage]);

  return (
    <div className="flex flex-col md:flex-row">
      <CategorySidebar categories={categories} onCategoryChange={handleCategoryChange} />
      <ProductsPageClient
        products={filteredProducts}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
