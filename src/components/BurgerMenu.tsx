"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import GSKLogo from "../../public/logo/new-logo.png";
import { Category } from "@prisma/client"; // Import Category type
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import SearchBox from "./SearchBox";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[]; // Make categories required
}

export default function BurgerMenu({
  isOpen,
  setIsOpen,
  categories,
}: BurgerMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null); // Tracks which submenu is open
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    <>
      <div ref={mobileMenuRef} className="relative z-50">
        {/* Toggle Button */}
        <button
          className="lg:hidden ml-4 text-teal-600 focus:outline-none absolute -top-[70px] right-5 z-60"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-[75%] sm:w-2/3 lg:hidden h-screen bg-teal-50 ease-in-out duration-500 mt-[150px] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
        >
          <div className="px-6">
          <SearchBox tabIndex={!isOpen ? 0 : -1} />
</div>
          {/* Navigation Links */}
          <nav className="flex-col py-4 text-teal-600 px-10" role="navigation">
            <ul>
              {/* Static Links */}
              <li className="py-4 hover:underline hover:decoration-yellow-300">
                <Link
                  href="/about"
                  className="hover:text-yellow-500"
                  onClick={() => setIsOpen(false)}
                  tabIndex={isOpen ? 0 : -1}
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
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="text-teal-600 text-lg hover:text-yellow-500">
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
                {openSubmenu === "services" && (
                  <ul className="pl-4 mt-2">
                    <li
                      className="py-2 hover:bg-teal-100 hover:underline"
                      role="none"
                    >
                      <Link
                        href="/services/#import"
                        className="hover:text-yellow-500"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Import
                      </Link>
                    </li>
                    <li
                      className="py-2 hover:bg-teal-100 hover:underline"
                      role="none"
                    >
                      <Link
                        href="/services/#export"
                        className="hover:text-yellow-500"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Export
                      </Link>
                    </li>
                    <li
                      className="py-2 hover:bg-teal-100 hover:underline"
                      role="none"
                    >
                      <Link
                        href="/services/#distribution"
                        className="hover:text-yellow-500"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Distribution
                      </Link>
                    </li>
                  </ul>
                )}
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
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="text-teal-600 text-lg hover:text-yellow-500">
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
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="py-2 hover:bg-teal-100 hover:underline"
                      >
                        <Link
                          href={`/category/${encodeURIComponent(category.id)}`}
                          className="hover:text-yellow-500"
                          onClick={() => setIsOpen(false)}
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
      </div>
    </>
  );
}
