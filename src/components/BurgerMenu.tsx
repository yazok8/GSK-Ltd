// src/app/(customerFacing)/components/BurgerMenu.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import FaTimes for close icon
import GSKLogo from "../../public/logo/gsk-nobg.png";
import { NavLinks } from "@/app/(customerFacing)/data/NavLinks";
import { Input } from "./ui/input";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BurgerMenu({ isOpen, setIsOpen }: BurgerMenuProps) {
  const [isServicesOpen, setIsServicesOpen] = useState(false); // Services dropdown state
  const [isProductOpen, setIsProductOpen] = useState(false); // Products dropdown state

  const mobileServicesRef = useRef<HTMLLIElement>(null);
  const mobileProductsRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

 // Handle clicks outside the mobile menu to close it
 useOnClickOutside(mobileMenuRef, () => {
    if (isOpen) {
      setIsOpen(false);
      setIsProductOpen(false);
      setIsServicesOpen(false)
    }
  });

  // Prevent body from scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Escape key to close the menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setIsServicesOpen(false)
        setIsProductOpen(false)
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
      <div className="flex items-center">
              <Input
                placeholder="Search" 
              />
              <FaSearch size={24} className="ml-2 text-white" />
            </div>

      {/* Navigation Links */}
      <div className="flex-col py-4 text-white">
        <ul>
          {NavLinks.map(({ id, header, links }) => {
            const isServices = header.toLowerCase() === "services";
            const isProducts = header.toLowerCase() === "products";
            return (
              <React.Fragment key={id}>
                {/* Main Navigation Link */}
                {!links ? (
                  <li
                    className="py-4 hover:underline hover:decoration-yellow-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={`/#${header}`} className="hover:text-yellow-500">
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </Link>
                  </li>
                ) : (
                  <li
                    className="py-4 relative"
                    ref={isServices ? mobileServicesRef : isProducts ? mobileProductsRef : null}
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        isServices
                          ? setIsServicesOpen((prev) => !prev)
                          : isProducts
                          ? setIsProductOpen((prev) => !prev)
                          : null
                      }
                    >
                      <span className="text-white text-lg hover:text-yellow-500">
                        {header.charAt(0).toUpperCase() + header.slice(1)}
                      </span>
                      {/* Dropdown Indicator Icon */}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          (isServices && isServicesOpen) ||
                          (isProducts && isProductOpen)
                            ? "transform rotate-180"
                            : ""
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
                    </div>

                    {/* Dropdown Menu: Visible When Corresponding State is True */}
                    {(isServices && isServicesOpen) ||
                    (isProducts && isProductOpen) ? (
                      <ul className="pl-4 mt-2">
                        {links.map((link) => (
                          <li
                            key={link.id}
                            className="py-2 hover:bg-teal-600 hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            <Link href={`/#${link.title}`}>
                            {link.title.charAt(0).toUpperCase() + link.title.slice(1)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
