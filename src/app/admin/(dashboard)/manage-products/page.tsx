import React from "react";
import prisma from "@/lib/prisma";
import ProductsTable from "./components/ProductsTable";

export default async function ManageProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      inStock: true,
      category: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  // 1) If user is not logged in or is VIEW_ONLY, block access

  return (
    <>
      <ProductsTable products={products} />
    </>
  );
}
