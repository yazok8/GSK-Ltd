"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductsPageClient from "./ProductsPageClient";
import CategorySidebar from "./CategorySidebar";
import { MappedProduct } from "@/types/MappedProduct";
import { useSearchParams } from "next/navigation";

interface RootClientProps {
  categories: { id: string; name: string }[];
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
  expandedId?: string; // Added expandedId prop
}

export default function ProductsRootClient({
  categories,
  products: initialProducts,
  currentPage,
  totalPages: initialTotalPages,
  expandedId,
}: RootClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const updateUrlWithoutRefresh = (params: { [key: string]: string | null }) => {
    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Update or add new parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    // Construct the new URL
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
    
    // Update URL without page refresh
    window.history.pushState({}, '', newUrl);
    return currentParams;
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryIds.length > 0) {
      params.set("categoryIds", categoryIds.join(","));
    } else {
      params.delete("categoryIds");
    }

    // Preserve expandedId and page
    const expandedId = params.get('expandedId');
    const currentPage = params.get('page');

    // Create final URL parameters
    const urlParams: { [key: string]: string | null } = {
      categoryIds: categoryIds.length > 0 ? categoryIds.join(",") : null,
      page: currentPage || "1",
      ...(expandedId && { expandedId })
    };

    // Update URL and fetch new data
    updateUrlWithoutRefresh(urlParams);
    fetchFilteredProducts(categoryIds, parseInt(currentPage || "1"));
  };

  const fetchFilteredProducts = useCallback(async (categoryIds: string[], page: number) => {
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '20');
      
      if (categoryIds.length > 0) {
        params.set('categoryIds', categoryIds.join(','));
      }

      // Include expandedId if present
      if (expandedId) {
        params.set('expandedId', expandedId);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  },[expandedId])

  // Effect to handle URL parameter changes
  useEffect(() => {
    const categoryIds = searchParams.get('categoryIds')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    
    fetchFilteredProducts(categoryIds, page);
  }, [searchParams,fetchFilteredProducts]);

  return (
    <div className="flex flex-col md:flex-row">
      <CategorySidebar 
        categories={categories} 
        onCategoryChange={handleCategoryChange}
        selectedCategories={searchParams.get('categoryIds')?.split(',').filter(Boolean) || []} // Pass selectedCategories
      />
      <div className="flex-1">
        <ProductsPageClient
          products={products}
          currentPage={parseInt(searchParams.get('page') || '1')}
          totalPages={totalPages}
          baseUrl="/products"
          expandedId={searchParams.get('expandedId') || undefined} // Ensure type is string | undefined
        />
      </div>
    </div>
  );
}
