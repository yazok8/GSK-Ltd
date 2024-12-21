// src/app/(customerFacing)/layout/ClientLayout.tsx

"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import GSKLogo from "../../../public/logo/new-logo.png";
import { Input } from "@/components/ui/input";
import { FaSearch, FaBars } from "react-icons/fa";
import dynamic from "next/dynamic"; // Import dynamic
import { Category } from "@prisma/client";
import SearchBox from "@/components/SearchBox";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Dynamically import BurgerMenu with no SSR
const BurgerMenu = dynamic(() => import("@/components/BurgerMenu"), {
  ssr: false,
});

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isOpen, setIsOpen] = useState(false); // State to control BurgerMenu visibility
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories once the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories"); // Ensure this API returns ObjectIDs as strings
        if (response.ok) {
          const data: Category[] = await response.json();
          if (data.length > 0) {
            setCategories(data);
          } else {
            console.error("Failed to fetch categories: No data returned");
          }
        } else {
          console.error("Failed to fetch categories: Response not ok");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Top Navigation Bar: Logo and Search */}
      <nav className="w-full text-black duration-300 ease-in p-4 z-10 bg-teal-50">
        <div className="flex justify-between items-center">
          <div className='w-[7rem] h-[4rem] md:w-[10rem] md:h-[6rem]'>
          {/* Logo */}
          <Link href="/">
            <Image src={GSKLogo} alt="GSK Logo" />
          </Link>
          </div>

          {/* Search Input and Burger Icon Container */}
          <div className="flex items-center">
            <div className='hidden md:block'>
           <SearchBox/>
           </div>

            {/* Burger Icon: Visible Only on Mobile */}
            <button
              className="lg:hidden ml-4 text-teal-500 focus:outline-none"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Teal Navigation Bar with Links: Hidden on Mobile */}
      <div className="h-12 hidden lg:flex justify-center items-center w-full bg-teal-500 z-50">
        <ul className="flex space-x-10 font-bold">
          {/* Static Links */}
          <li className="text-sm uppercase text-white">
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </li>
          <li className="text-sm uppercase text-white relative group">
            <Link href="/services" className="hover:underline">
              Our Services
            </Link>
            <ul
              className="
              absolute 
              top-full 
              left-0 
              w-60 
              bg-white 
              border 
              rounded 
              shadow-lg 
              opacity-0 
              invisible 
              group-hover:opacity-100 
              group-hover:visible 
              transition-opacity 
              duration-300 
              z-20
            "
              role="menu"
              aria-label="Services submenu"
            >
              <li
                className="px-4 py-2 hover:bg-gray-100 text-yellow-500 hover:underline"
                role="none"
              >
                <Link
                  href="/services/#import"
                  className="block focus:outline-none"
                  role="menuitem"
                >
                  Import
                </Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 text-yellow-500 hover:underline"
                role="none"
              >
                <Link
                  href="/services/#export"
                  className="block focus:outline-none"
                  role="menuitem"
                >
                  Export
                </Link>
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 text-yellow-500 hover:underline"
                role="none"
              >
                <Link
                  href="/services/#distribution"
                  className="block focus:outline-none"
                  role="menuitem"
                >
                  Distribution
                </Link>
              </li>
            </ul>
          </li>

          {/* Dynamic Categories */}
          <li className="text-sm uppercase text-white relative group">
            <Link href="/products" className="hover:underline">
              Our Products
            </Link>
            <ul
              className="
                     absolute 
                     top-full 
                     left-0 
                     w-60 
                     bg-white 
                     border 
                     rounded 
                     shadow-lg 
                     opacity-0 
                     invisible 
                     group-hover:opacity-100 
                     group-hover:visible 
                     transition-opacity 
                     duration-300 
                     z-20
                    "
              role="menu"
              aria-label="Products submenu"
            >
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="px-4 py-2 hover:bg-gray-100 text-yellow-500 hover:underline"
                  role="none"
                >
                  <Link
                    href={`/category/${encodeURIComponent(category.id)}`}
                    className="block focus:outline-none"
                    role="menuitem"
                  >
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Static Links */}
          <li className="text-sm uppercase text-white">
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Burger Menu: Always Rendered and Controlled via Props */}
      <BurgerMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        categories={categories}
      />

      <div>{children}</div>
    </>
  );
}
