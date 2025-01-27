import React from 'react';
import ProductsGrid from './ProductGrid';
import { MappedProduct } from '@/types/MappedProduct';
import ProductErrorBoundary from '@/components/error-boundaries/ProductErrorBoundary';

interface ProductsPageClientProps {
  products: MappedProduct[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  expandedId?: string;
}

const ProductsPageClient: React.FC<ProductsPageClientProps> = ({
  products = [],
  currentPage = 1,
  totalPages = 1,
  baseUrl,
  expandedId
}) => {
  return (
    <div className="container mx-auto px-4">
      <ProductErrorBoundary>
        <ProductsGrid
          products={products}
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={baseUrl}
          expandedId={expandedId}
        />
      </ProductErrorBoundary>
    </div>
  );
};

export default ProductsPageClient;
