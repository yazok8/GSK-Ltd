import React from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductForm from "../../components/ProductForm";
import AdminContainer from "@/components/ui/AdminContainer";

type Product = Prisma.ProductGetPayload<object>;

export default async function AddProducts({
  params,
}: {
  params: { id?: string };
}) {
  let product: Product | null = null;

  if (params.id) {
    product = await prisma.product.findUnique({
      where: { id: params.id },
    });
  }

  return (
    <>
      <AdminContainer />
      <ProductForm product={product} />
    </>
  );
}
