// components/products/_components/ProductsPageClient.tsx

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { MappedProduct } from "@/types/MappedProduct";
import ProductsGrid from "./ProductGrid";

interface ProductsPageClientProps {
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function ProductsPageClient({
  products,
  currentPage,
  totalPages,
  baseUrl,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const expandedId = searchParams.get("expandedId") ?? undefined;

  return (
    <div className="container mx-auto p-4">
      <ProductsGrid
        products={products}
        expandedId={expandedId || undefined}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </div>
  );
}
