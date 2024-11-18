"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NavLinks } from "./data/NavLinks";
import Image from "next/image";
import GSKLogo from "../../../public/logo/new-logo.png";
import { Input } from "@/components/ui/input";
import { FaSearch, FaBars } from "react-icons/fa";
import dynamic from "next/dynamic"; // Import dynamic
import { Category } from "@prisma/client";

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
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          if(data.length > 0){
            setCategories(data);
          }
          console.error('Failed to fetch categories');
       
      }
    }catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);


  return (
    <>
      {/* Top Navigation Bar: Logo and Search */}
      <nav className="w-full text-black duration-300 ease-in p-4 z-[10] bg-white">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <Image src={GSKLogo} alt="GSK Logo" width={200} height={50} />
          </Link>

          {/* Search Input and Burger Icon Container */}
          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-2">
              <Input
                placeholder="Search"
                className="w-64 bg-gray-100 text-black rounded-md"
              />
              <FaSearch size={20} className="text-teal-500 cursor-pointer" />
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
          {NavLinks.map(({ id, header, links }) => (
            <li
              key={id}
              className="relative group text-sm uppercase cursor-pointer duration-200 ease-out hover:scale-105 text-white"
            >
              <Link href={`/#${header}`} className="focus:outline-none">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </Link>

              {/* Dropdown Menu: Visible on Hover if Links Exist */}
              {links && (
                <ul
                  className="absolute top-full left-0 w-40 bg-white border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300"
                  role="menu"
                  aria-label={`${header} submenu`}
                >
                  {categories.map((link) => (
                    <li
                      key={link.id}
                      className="px-4 py-2 hover:bg-gray-100 text-yellow-500 hover:underline"
                      role="none"
                    >
                      <Link
                        href={`/category/${link.id}`}
                        className="block focus:outline-none"
                        role="menuitem"
                      >
                        {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Burger Menu: Always Rendered and Controlled via Props */}
      <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      <div>{children}</div>
    </>
  );
}
