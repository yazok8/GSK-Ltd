import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import ProductsRootClient from "./_components/ProductsRootClient";
import { MappedProduct } from "@/types/MappedProduct";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type ProductsPageProps = {
  searchParams: {
    page?: string;
    categoryIds?: string;
    expandedId?: string;
    // Add other search params if necessary
  };
};

const PRODUCTS_PER_PAGE = 20;
async function ProductsContent({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const currentPage = isNaN(page) || page < 1 ? 1 : page;

  const categoryIds = searchParams.categoryIds?.split(",").filter(Boolean) || [];
  const expandedId = searchParams.expandedId;

  // Fetch total count of products based on category filters (excluding expandedId)
  const totalProducts = await prisma.product.count({
    where: categoryIds.length > 0
      ? { categoryId: { in: categoryIds } }
      : {},
  });

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  // Build the 'where' clause to include category filters and the expanded product
  const whereClause: any = {};

  if (categoryIds.length > 0 && expandedId) {
    whereClause.OR = [
      { categoryId: { in: categoryIds } },
      { id: expandedId },
    ];
  } else if (categoryIds.length > 0) {
    whereClause.categoryId = { in: categoryIds };
  } else if (expandedId) {
    whereClause.id = expandedId;
  }

  // Fetch products based on the 'where' clause
  const productsRaw = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    skip: (safeCurrentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
  });

  // Ensure no duplicate products if the expanded product is also in the category filter
  const uniqueProductsMap: { [key: string]: MappedProduct } = {};
  productsRaw.forEach((product) => {
    uniqueProductsMap[product.id] = {
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
    };
  });

  const products: MappedProduct[] = Object.values(uniqueProductsMap);

  // Fetch all categories for the sidebar
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
        expandedId={expandedId} // Pass expandedId here
      />
    </Suspense>
  );
}

export default async function ProductsPage(props: ProductsPageProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    }>
      <ProductsContent searchParams={props.searchParams} />
    </Suspense>
  );
}