// components/products/ProductsPage.tsx

import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductsRootClient from "./_components/ProductsRootClient";
import { MappedProduct } from "@/types/MappedProduct";

type ProductsPageProps = {
  searchParams: {
    page?: string;
    categoryIds?: string;
    // Add other search params if necessary
  };
};

const PRODUCTS_PER_PAGE = 20;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const currentPage = isNaN(page) || page < 1 ? 1 : page;

  // Fetch total count of products (consider filters if applied)
  const totalProducts = await prisma.product.count({
    where: searchParams.categoryIds
      ? {
          categoryId: {
            in: searchParams.categoryIds.split(","),
          },
        }
      : {},
  });

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  // Fetch products for the current page (consider filters if applied)
  const productsRaw = await prisma.product.findMany({
    where: searchParams.categoryIds
      ? {
          categoryId: {
            in: searchParams.categoryIds.split(","),
          },
        }
      : {},
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

  // Fetch all categories for the sidebar (if applicable)
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
