// src/app/(customerFacing)/components/Homepage/_components/CategoryCard.tsx

"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  id: string;
  name: string;
  description: string;
  image: string; // Must be strictly a string
};

export default function CategoryCard({
  id,
  name,
  description,
  image,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`} className="category-card cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={300}
          height={200}
          className="object-cover w-full h-48"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25 hover:bg-opacity-50 transition-opacity"></div>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
