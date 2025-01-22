"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MappedProduct } from "@/types/MappedProduct";
import ProductsGrid from "./ProductGrid";

interface ProductsPageClientProps {
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
}

export default function ProductsPageClient({ products, totalPages,currentPage }: ProductsPageClientProps) {

  const baseUrl = `/products`; 

  const searchParams = useSearchParams();
  const expandedId = searchParams.get("expandedId") ?? undefined;

  return (
    <div className="container mx-auto p-4">
      <ProductsGrid products={products} expandedId={expandedId || undefined} currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
    </div>
  );
}
