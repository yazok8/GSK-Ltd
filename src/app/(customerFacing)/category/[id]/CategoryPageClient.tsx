"use client";

import { getImageSrc } from '@/lib/imageHelper';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Category, Product } from '@prisma/client'
import Image from 'next/image';
import React, { Fragment, useState } from 'react'

interface CategoryPageClientProps{
    category: Category
    products:Product[];
}


export default function CategoryPageClient({category, products}:CategoryPageClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const closeModal = ()=>setSelectedProduct(null);
  
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col justify-center text-center">
        <h1 className="text-3xl font-bold mb-10">{category.name}</h1>
  
        {/* Render products */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-center items-center max-h-[300px] hover:underline cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <Image
                src={getImageSrc(product.images[0])}
                alt={product.name}
                width={250}
                height={100}
                className="mb-5 object-contain"
                loading="lazy"
                quality={80}
              />
              <h2 className="text-lg font-medium">{product.name}</h2>
            </div>
          ))}
        </div>
  
        {/* The modal: same as your existing Headless UI code */}
        <Transition appear show={!!selectedProduct} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              {/* Overlay */}
              <Transition
                as={Fragment}
                show={!!selectedProduct}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-50" />
              </Transition>
  
              {/* Centering trick */}
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
  
              {/* Modal content transition */}
              <Transition
                as={Fragment}
                show={!!selectedProduct}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl relative">
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                  >
                    <XMarkIcon className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </button>
  
                  {/* The actual product details */}
                  {selectedProduct && (
                    <div className="p-4">
                      <Image
                        src={getImageSrc(selectedProduct.images[0])}
                        alt={selectedProduct.name}
                        width={800}
                        height={600}
                        className="object-contain rounded-md"
                        priority
                        placeholder="blur"
                      />
                      <h3 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {selectedProduct.name}
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </DialogPanel>
              </Transition>
            </div>
          </Dialog>
        </Transition>
      </div>
  )
}
