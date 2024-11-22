import React from 'react'
import prisma  from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getImageSrc } from '@/lib/imageHelper';

export default async function ProductsPage() {

    const products = await prisma.product.findMany()

      return (
        <div id="#products">
            <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-col-3 gap-4'>
                {products && products.map((product)=>(
                    
                    <div key={product.id} className='flex flex-col justify-center items-center mt-6 bg-white shadow-md rounded-lg p-4'>
                    <Link href={`/products/${product.id}`}>
                      {/* Fixed Size Container */}
                      <div className='w-64 h-64 sm:w-80 sm:h-80 relative mb-5'>
                        <Image 
                          src={getImageSrc(product.images[0])} 
                          alt={product.name} 
                          fill 
                          className='object-cover rounded-lg' 
                          loading='lazy' 
                          quality={80} 
                        />
                      </div>
                      {/* Product Name */}
                      <h1 className='text-center text-lg font-semibold'>{product.name}</h1>
                    </Link>
                  </div>
                  
                ))}
            </div>
        </div>

      )

  
}
