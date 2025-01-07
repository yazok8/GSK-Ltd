// pages/products/_components/ProductsPageClient.tsx

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { MappedProduct } from "@/types/MappedProduct";
import ProductsGrid from "./ProductGrid";

interface ProductsPageClientProps {
  products: MappedProduct[];
}

export default function ProductsPageClient({ products }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const expandedId = searchParams.get("expandedId");

  // Example: pass expandedId down to ProductsGrid
  return (
    <div className="container mx-auto p-4">
      <ProductsGrid products={products} expandedId={expandedId || undefined} />
    </div>
  );
}
