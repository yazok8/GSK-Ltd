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
                    
                    <div key={product.id} className='flex flex-col justify-center items-center'> 
                    <Link href={`/product/${product.id}`}> 
                        <Image src={getImageSrc(product.images[0])} alt={product.name} width={250} height={100} className='mb-5 object-contain' loading='lazy' quality={80}/>
                        <h1>{product.name}</h1>
                        </Link>
                    </div>
                ))}
            </div>
        </div>

      )

  
}
