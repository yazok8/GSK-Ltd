"use client";

import { useState } from "react";
import ProductsPageClient from "./ProductsPageClient";
import CategorySidebar from "./CategorySidebar";
import { MappedProduct } from "@/types/MappedProduct";

interface RootClientProps {
  categories: { id: string; name: string }[];
  products: MappedProduct[];
}

export default function ProductsRootClient({ categories, products }: RootClientProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleCategoryChange = async (categoryIds: string[]) => {
    if (categoryIds.length === 0) {
      // No categories selected => show all
      setFilteredProducts(products);
      return;
    }
    const res = await fetch(`/api/products?categoryIds=${categoryIds.join(",")}`);
    const data = await res.json();

    // 2) Update the filtered list
    setFilteredProducts(data);
  };



  return (
    <div className="flex flex-col md:flex-row">
      {/* Now the handler is defined in *this client component* */}
      <CategorySidebar categories={categories} onCategoryChange={handleCategoryChange} />
      <ProductsPageClient products={filteredProducts} />
    </div>
  );
}
