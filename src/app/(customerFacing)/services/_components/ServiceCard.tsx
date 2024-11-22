// components/ServiceCard.tsx

"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, image, alt, link }) => {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="w-full h-48 relative">
        <Image
          src={image}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          placeholder="blur"
          loading="lazy"
        />
      </div>
      <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-lg text-gray-600 line-clamp-2">
        {description}
      </p>
      <Link
        href={link}
        className="mt-4 text-lg font-semibold text-blue-600 border-b-4 border-blue-500 hover:text-blue-800 transition-colors duration-200"
      >
        Learn More
      </Link>
    </div>
  );
};

export default ServiceCard;
