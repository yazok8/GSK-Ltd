import React from "react";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductForm from "./components/ProductForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type Product = Prisma.ProductGetPayload<object>;

export default async function AddProducts({
  params,
}: {
  params: { id?: string };
}) {

  const session = await getServerSession(authOptions);

  let product: Product | null = null;

  if (params.id) {
    product = await prisma.product.findUnique({
      where: { id: params.id },
    });
  }

  return (
    <>
      <ProductForm product={product} session={session} />
    </>
  );
}
