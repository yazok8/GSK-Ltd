import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
// Import your new "root-level" client component
import ProductsRootClient from "./_components/ProductsRootClient";

export default async function ProductsPage() {
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });


  const productsRaw = await prisma.product.findMany({
    include: { category: true },
  });
  const products = productsRaw.map((product) => ({
    id: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    category: product.category?{
      id: product.category.id,
      name: product.category.name,
      description: product.category.description,
      image: product.category.image,
      featured: product.category.featured,
    } : null,
    price: product.price,
    inStock: product.inStock,
    brand: product.brand,
    categoryId: product.category?.id ?? null,
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Pass only data as props, not functions */}
      <ProductsRootClient categories={allCategories} products={products} />
    </Suspense>
  );
}
