// pages/products/page.tsx

import React from 'react';
import prisma from '@/lib/prisma';
import { MappedProduct } from '@/types/MappedProduct';
import ProductsGrid from './_components/ProductGrid';
import ProductsPageClient from './_components/ProductsPageClient';

const ProductsPage: React.FC = async () => {

  // Fetch products from your database
  const productsRaw = await prisma.product.findMany({
    include: {
      category: true, // Include category to access its name
    },
  });

  const products: MappedProduct[] = productsRaw.map((product) => ({
    id: product.id,
    images: product.images,
    name: product.name,
    description: product.description,
    category: product.category ? product.category.name : "Uncategorized",
    price: product.price,
    inStock: product.inStock,
    brand: product.brand,
  }));

  return (
    <div className="container mx-auto p-4">
      <ProductsPageClient products={products} />
    </div>
  );
};

export default ProductsPage;
