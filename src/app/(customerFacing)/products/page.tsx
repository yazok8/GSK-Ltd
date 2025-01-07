// pages/products/page.tsx (Server Component)

import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import { MappedProduct } from "@/types/MappedProduct";
import ProductsPageClient from "./_components/ProductsPageClient"; // <-- client component

export default async function ProductsPage() {
  // 1. Fetch data on the server
  const productsRaw = await prisma.product.findMany({
    include: {
      category: true, 
    },
  });

  const products: MappedProduct[] = productsRaw.map((product) => ({
    id: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    category: product.category ? product.category.name : "Uncategorized",
    price: product.price,
    inStock: product.inStock,
    brand: product.brand,
  }));

  return (
    <Suspense fallback={<div>Loading Products...</div>}>
      <ProductsPageClient products={products} />
    </Suspense>
  );
}
