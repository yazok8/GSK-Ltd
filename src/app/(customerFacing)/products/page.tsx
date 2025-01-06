// pages/products/page.tsx

import React from 'react';
import prisma from '@/lib/prisma';
import ProductsGrid from './_components/ProductGrid'; // Ensure the path is correct
import { MappedProduct } from '@/types/MappedProduct';

const ProductsPage: React.FC = async () => {
  // Fetch products from your database
  const products: MappedProduct[] = await prisma.product.findMany({
    include: {
      category: true,
    },
  }).then((results) =>
    results.map((product) => ({
      id: product.id,
      images: product.images,
      name: product.name,
      description: product.description,
      category: product.category ? product.category.name : "Uncategorized",
    }))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <ProductsGrid products={products} />
    </div>
  );
};

export default ProductsPage;
