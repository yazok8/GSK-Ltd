// app/products/page.jsx (Assuming a Next.js 13+ App Router structure)

import React from 'react';
import prisma from '@/lib/prisma';
import ProductsGrid from './_components/ProductGrid'; // We'll create this next

export default async function ProductsPage() {
  const products = await prisma.product.findMany();

  return (
    <div id="products" className="py-8 px-4 md:px-8 transition-colors duration-500 max-w-[1920px] mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Products</h2>
      <ProductsGrid products={products} />
    </div>
  );
}