import React from "react";
import prisma from "@/lib/prisma";
import AdminContainer from "@/components/ui/AdminContainer";
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

  return (
    <>
      <AdminContainer />
      <ProductsTable products={products} />
    </>
  );
}
