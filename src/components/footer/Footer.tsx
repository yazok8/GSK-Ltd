import React from "react";
import Link from "next/link";
import { Category as PrismaCategory } from "@prisma/client";
import { getAllCategories } from "@/lib/getCategories";
import { AiFillFacebook, AiFillInstagram, AiFillLinkedin } from "react-icons/ai";

export default async function Footer() {
  const categories: PrismaCategory[] = await getAllCategories();
  return (
    <footer className="bg-teal-500 text-white">
      <div className="max-w-[1920px] mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Column 1: Logo and Social Media Links */}
          <div className="mb-8 md:mb-0 md:w-1/3">
            {/* Replace with your actual logo */}
            <Link href='/' className="text-2xl font-bold text-white">GSK Limited</Link>
            <div className="flex gap-4 mt-4">
              <Link href="https://www.instagram.com/gskinternationals/" target="_blank">
                <AiFillInstagram size={30} className="hover:text-gray-300 text-white" />
              </Link>
              <Link href="https://www.facebook.com/GSKGW2019" target="_blank">
                <AiFillFacebook size={30} className="hover:text-gray-300 text-white" />
              </Link>
              <Link href="#" target="_blank">
                <AiFillLinkedin size={30} className="hover:text-gray-300 text-white" />
              </Link>
            </div>
          </div>
          {/* Column 2: Navigation Links */}
          <div className="mb-8 md:mb-0 md:w-1/3">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-white">
              <li>
                <Link href="/contact" className="hover:text-gray-300 text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-gray-300">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3: Categories */}
          <div className="md:w-1/3 text-white">
            <h3 className="text-xl font-bold mb-4">Explore Our Products</h3>
            <div className="grid grid-cols-2 gap-2 text-white">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="hover:text-gray-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm font-bold ">
          <p className="text-white">
            © GSK LTD., 2025. All rights reserved. <Link href="https://www.yazankherfan.ca" target="_blank" className="hover:cursor-pointer text-black underline">Yazan Kherfan</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}