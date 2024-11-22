// src/app/(customerFacing)/components/BurgerMenu.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import GSKLogo from "../../public/logo/gsk-nobg.png";
import { Input } from "./ui/input";
import slugify from "slugify";
import { Category } from "@prisma/client"; // Import Category type
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories?: Category[]; // Ensure categories are required
}

export default function BurgerMenu({
  isOpen,
  setIsOpen,
  categories,
}: BurgerMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null); // Tracks which submenu is open
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Handle clicks outside the mobile menu to close it
  useOnClickOutside(mobileMenuRef, () => {
    if (isOpen) {
      setIsOpen(false);
      setOpenSubmenu(null);
    }
  });

  // Prevent body from scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Escape key to close the menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setOpenSubmenu(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen]);

  if (typeof window === "undefined") return null; // Ensure window is available

  return (
    <div
      ref={mobileMenuRef}
      className={`fixed top-0 left-0 w-[75%] sm:w-2/3 lg:hidden h-screen bg-teal-500 p-10 ease-in-out duration-500 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      id="mobile-menu"
      aria-hidden={!isOpen}
    >
      <div className="flex justify-between items-center mb-8">
        {/* Logo */}
        <Link href="/">
          <Image
            src={GSKLogo}
            alt="GSK Logo"
            width={150}
            height={50}
            className="cursor-pointer"
          />
        </Link>

        {/* Close (X) Icon */}
        <button
          className="text-white focus:outline-none hover:cursor-pointer"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          <FaTimes size={24} />
        </button>
      </div>
      <div className="flex items-center mb-6">
        <Input placeholder="Search" />
        <FaSearch size={24} className="ml-2 text-white" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-col py-4 text-white" role="navigation">
        <ul>
          {/* Static Links */}
          <li className="py-4 hover:underline hover:decoration-yellow-300">
            <Link
              href="/about"
              className="hover:text-yellow-500"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
          </li>

          {/* Services Submenu */}
          <li className="py-4 relative" key="services">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none"
              onClick={() =>
                setOpenSubmenu((prev) =>
                  prev === "services" ? null : "services"
                )
              }
              aria-haspopup="true"
              aria-expanded={openSubmenu === "services"}
            >
              <span className="text-white text-lg hover:text-yellow-500">
                Our Services
              </span>
              {/* Dropdown Indicator Icon */}
              <svg
                className={`w-4 h-4 transition-transform ${
                  openSubmenu === "services" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu for Services */}
            <li className="text-sm uppercase text-white relative group">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none"
              onClick={() =>
                setOpenSubmenu((prev) =>
                  prev === "services" ? null : "services"
                )
              }
              aria-haspopup="true"
              aria-expanded={openSubmenu === "services"}
            >
            </button>
            {openSubmenu === "services" && (
              <ul className="pl-4 mt-2">
            <li className="py-2 hover:bg-teal-600 hover:underline" role="none">
                <Link href="/services/#import" className="hover:text-yellow-500" role="menuitem">
                  Import
                </Link>
              </li>
              <li className="py-2 hover:bg-teal-600 hover:underline" role="none">
                <Link href="/services/#export" className="hover:text-yellow-500" role="menuitem">
                  Export
                </Link>
              </li>
              <li className="py-2 hover:bg-teal-600 hover:underline" role="none">
                <Link href="/services/#distribution" className="hover:text-yellow-500" role="menuitem">
                  Distribution
                </Link>
              </li>
              </ul>
            )}
          </li>         
          </li>

          {/* Dynamic Categories Submenu */}
          <li className="py-4 relative" key="products">
            <button
              className="flex justify-between items-center w-full text-left focus:outline-none"
              onClick={() =>
                setOpenSubmenu((prev) =>
                  prev === "products" ? null : "products"
                )
              }
              aria-haspopup="true"
              aria-expanded={openSubmenu === "products"}
            >
              <span className="text-white text-lg hover:text-yellow-500">
                Our Products
              </span>
              {/* Dropdown Indicator Icon */}
              <svg
                className={`w-4 h-4 transition-transform ${
                  openSubmenu === "products" ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu for Products */}
            {openSubmenu === "products" && (
              <ul className="pl-4 mt-2">
                {categories?.map((category) => (
                  <li
                    key={category.id}
                    className="py-2 hover:bg-teal-600 hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link
                      href={`/category/${encodeURIComponent(category.id)}`}
                      className="hover:text-yellow-500"
                    >
                      {category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Static Links */}
          <li className="py-4 hover:underline hover:decoration-yellow-300">
            <Link
              href="/contact"
              className="hover:text-yellow-500"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
