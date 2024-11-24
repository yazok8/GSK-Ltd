// components/ProductsGrid.jsx

'use client'; // This directive makes the component a client component

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageSrc } from '@/lib/imageHelper';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Product } from '@prisma/client'; // Ensure this includes 'images' and 'name'

export type ProductGridType = {
  products: Product[];
};

export default function ProductsGrid({ products }: ProductGridType) {
  // Define the state to hold a Product or null
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const closeModal = () => setSelectedProduct(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products && products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center mt-6 p-2 bg-transparent"
          >
            <Link href={`/products/${product.id}`}>
              {/* Adjusted Image Container Size */}
              <div
                className="w-72 h-52 sm:w-72 sm:h-60 relative mb-3 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  setSelectedProduct(product); // Set the entire product
                }}
              >
                <Image
                  src={getImageSrc(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md -z-10"
                  loading="lazy"
                  quality={80}
                />
              </div>
              {/* Product Name */}
              <h3 className="text-center text-base sm:text-lg font-medium underline">
                {product.name}
              </h3>
            </Link>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition appear show={!!selectedProduct} as={React.Fragment}>
        <Dialog
          open={!!selectedProduct}
          onClose={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
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
                    blurDataURL="/placeholder.webp"
                  />
                  <h3 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {selectedProduct.name}
                  </h3>
                  {/* Additional product details can be added here */}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
