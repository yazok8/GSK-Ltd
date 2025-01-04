'use client';

import React, { useState, Fragment, useEffect } from 'react';
import Image from 'next/image';
import { getImageSrc } from '@/lib/imageHelper';
import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Product } from '@prisma/client'; // Ensure this includes 'images', 'name', 'description'



export default function ProductsGrid() {
  // State to hold the selected product or null
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);

  // Function to close the modal
  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", {
        cache: "no-store",  
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch product data.");
      }
    })();
  }, []);

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center mt-6 p-2 bg-transparent"
          >
            {/* Product Image */}
            <div
              className="w-72 h-52 sm:w-72 sm:h-60 relative mb-3 cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                setSelectedProduct(product); // Set the selected product
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
            <h3
              className="text-center text-base sm:text-lg font-medium cursor-pointer"
              onClick={(e) => {
                e.preventDefault(); // Prevent default behavior
                setSelectedProduct(product); // Set the selected product
              }}
            >
              {product.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition appear show={!!selectedProduct} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            {/* Overlay Transition */}
            <Transition
              as={Fragment}
              show={!!selectedProduct} // Added show prop
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Manually create the overlay */}
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition>

            {/* Trick to center the modal */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* Modal Content Transition */}
            <Transition
              as={Fragment}
              show={!!selectedProduct} // Added show prop
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                >
                  <XMarkIcon className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </button>

                {/* Modal Content */}
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
                    <p className='mt-2 text-gray-600 dark:text-gray-300'>
                      {selectedProduct.description}
                    </p>
                    {/* Additional product details can be added here */}
                  </div>
                )}
              </DialogPanel>
            </Transition>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
