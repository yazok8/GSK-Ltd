import React from 'react'
import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetails from '../_components/ProductDetails';

type ProductPageProps = {
    product: {
      id: string;
      images: string [];
      name: string;
      description: string;
      category: string; // Ensuring category is a string
    };
  };

export default async function ProductPage({params:{id}}:{params:{id:string}}) {
  
  const product = await prisma.product.findUnique({
    where:{id}, 
    include:{category:true}
  });

  if(product == null) return notFound(); 

    // Transform the product data to match ProductPageProps
    const updatedProduct: ProductPageProps['product'] = {
        id: product.id,
        images: product.images,
        name: product.name,
        description: product.description,
        category: product.category ? product.category.name : 'Uncategorized', // Extract category name
      };


    return <ProductDetails product={updatedProduct}  />
}
