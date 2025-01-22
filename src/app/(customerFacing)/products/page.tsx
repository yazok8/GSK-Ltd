// pages/products/page.tsx or app/products/page.tsx

import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductsRootClient from "./_components/ProductsRootClient";
import { MappedProduct } from "@/types/MappedProduct";

type ProductsPageProps = {
  searchParams: {
    page?: string;
  };
};

const PRODUCTS_PER_PAGE = 20; // Define how many products per page

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10);

  // Validate page number
  const currentPage = isNaN(page) || page < 1 ? 1 : page;

  const totalProducts = await prisma.product.count();

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Ensure currentPage does not exceed totalPages
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  // Fetch paginated products
  const productsRaw = await prisma.product.findMany({
    include: { category: true },
    skip: (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
  });

  const products: MappedProduct[] = productsRaw.map((product) => ({
    id: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          description: product.category.description,
          image: product.category.image,
          featured: product.category.featured,
        }
      : null,
    price: product.price,
    inStock: product.inStock,
    brand: product.brand,
    categoryId: product.category?.id ?? null,
  }));

  // Fetch all categories
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsRootClient
        categories={allCategories}
        products={products}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
      />
    </Suspense>
  );
}
