// components/products/ManageProducts.tsx

import React from "react";
import prisma from "@/lib/prisma";
import ProductsTable from "./components/ProductsTable";

type ManageProductsProps = {
  searchParams: {
    page?: string;
  };
};

export default async function ManageProducts({ searchParams }: ManageProductsProps) {
  const PRODUCTS_PER_PAGE = 20;

  // Extract and validate the 'page' query parameter
  const page = parseInt(searchParams.page || '1', 10);
  const currentPage = isNaN(page) || page < 1 ? 1 : page;

  // Fetch the total number of products
  const totalProducts = await prisma.product.count();

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Ensure the current page does not exceed the total number of pages
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  // Fetch products for the current page
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      inStock: true,
      category: { select: { name: true } },
    },
    orderBy: { name: "asc" },
    skip: (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
  });

  const baseUrl = `/admin/manage-products`;

  // TODO: Implement access control (e.g., check if user is admin)

  return (
    <>
      <ProductsTable 
        products={products} 
        currentPage={safeCurrentPage} 
        totalPages={totalPages} 
        baseUrl={baseUrl} 
      />
    </>
  );
}
