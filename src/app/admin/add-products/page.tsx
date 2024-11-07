import React from 'react';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import ProductForm from './components/ProductForm';

type ProductWithImages = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

export default async function AddProducts({
  params,
}: {
  params: { id?: string };
}) {
  let product: ProductWithImages | null = null;

  if (params.id) {
    product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true },
    });
  }

  return <ProductForm product={product} />;
}
