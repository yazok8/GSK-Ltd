"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MappedProduct } from "@/types/MappedProduct";
import ProductsGrid from "./ProductGrid";

interface ProductsPageClientProps {
  products: MappedProduct[];
}

export default function ProductsPageClient({ products }: ProductsPageClientProps) {
  
  const searchParams = useSearchParams();
  const expandedId = searchParams.get("expandedId") ?? undefined;

  return (
    <div className="container mx-auto p-4">
      <ProductsGrid products={products} expandedId={expandedId || undefined} />
    </div>
  );
}
