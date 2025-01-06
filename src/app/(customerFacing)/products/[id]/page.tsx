import React from 'react'
import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetails from '../_components/ProductDetails';
import { Category } from '@prisma/client';
import { MappedProduct } from '@/types/MappedProduct';

type ProductPageProps = {
    product: {
      id: string;
      images: string [];
      name: string;
      description: string;
      category: string; // Ensuring category is a string
    };
    category:Category
  };

export default async function ProductPage({params:{id}}:{params:{id:string}}) {
  
  const product = await prisma.product.findUnique({
    where:{id}, 
    include:{category:true}
  });

  if(product == null) return notFound(); 

    // Transform the product data to match ProductPageProps
    const mappedProduct: MappedProduct = {
      id: product.id,
      images: product.images,
      name: product.name,
      description: product.description,
      category: product.category ? product.category.name : 'Uncategorized',
      // Include other fields if necessary
    };


      const category: Category = product.category || {
        id: '67605159303de23aa0e8bd1e',
        name: 'Uncategorized',
        description:'',
        image:'placeholder.webp',
        featured:true
        // Add other Category fields as required
      };
    
      return <ProductDetails product={mappedProduct} category={category} />;
    }