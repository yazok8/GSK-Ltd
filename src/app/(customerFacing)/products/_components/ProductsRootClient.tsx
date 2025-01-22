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
  const [filteredTotalPages, setFilteredTotalPages] = useState(totalPages);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryIds: string[]) => {
    const query = new URLSearchParams(searchParams.toString());
    if (categoryIds.length > 0) {
      query.set("categoryIds", categoryIds.join(","));
    } else {
      query.delete("categoryIds");
    }
    query.set("page", "1");
    router.push(`/products?${query.toString()}`);
  };

  useEffect(() => {
    const categoryIds = searchParams.get("categoryIds")?.split(",") || [];
    
    const fetchFilteredProducts = async () => {
      if (categoryIds.length === 0) {
        setFilteredProducts(products);
        setFilteredTotalPages(totalPages);
        return;
      }

      const res = await fetch(
        `/api/products?categoryIds=${categoryIds.join(",")}&page=${currentPage}&limit=20`
      );
      const data = await res.json();
      setFilteredProducts(data.products);
      setFilteredTotalPages(data.totalPages);
    };

    fetchFilteredProducts();
  }, [searchParams, currentPage, products,totalPages]);

  return (
    <div className="flex flex-col md:flex-row">
      <CategorySidebar 
        categories={categories} 
        onCategoryChange={handleCategoryChange} 
      />
      <div className="flex-1">
        <ProductsPageClient
          products={filteredProducts}
          currentPage={currentPage}
          totalPages={filteredTotalPages}
          baseUrl="/products"
        />
      </div>
    </div>
  );
}