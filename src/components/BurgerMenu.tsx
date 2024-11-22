// src/app/(customerFacing)/components/BurgerMenu.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import GSKLogo from "../../public/logo/gsk-nobg.png";
import { NavLinks, NavLink, NavLinkSubmenu, NavLinkLink } from "@/app/(customerFacing)/data/NavLinks";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Input } from "./ui/input";
import slugify from "slugify";

interface BurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



export default function BurgerMenu({ isOpen, setIsOpen }: BurgerMenuProps) {
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
          {NavLinks.map((navLink: NavLink) => {
            if (isNavLinkSubmenu(navLink)) {
              const { id, header, submenu, links } = navLink;
              const isSubmenuOpen = openSubmenu === submenu;

              // Function to handle submenu toggle
              const handleSubmenuToggle = () => {
                setOpenSubmenu((prev) => (prev === submenu ? null : submenu));
              };

              return (
                <li className="py-4 relative" key={id}>
                  <button
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={handleSubmenuToggle}
                    aria-haspopup="true"
                    aria-expanded={isSubmenuOpen}
                  >
                    <span className="text-white text-lg hover:text-yellow-500">
                      {header}
                    </span>
                    {/* Dropdown Indicator Icon */}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isSubmenuOpen ? "rotate-180" : ""
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

                  {/* Dropdown Menu */}
                  {isSubmenuOpen && (
                    <ul className="pl-4 mt-2">
                      {links.map((link: NavLinkLink) => (
                        <li
                          key={link.id}
                          className="py-2 hover:bg-teal-600 hover:underline"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link
                            href={
                              submenu === "services"
                                ? `/services/#${slugify(link.title)}`
                                : `/category/${encodeURIComponent(slugify(link.title))}`
                            }
                            className="hover:text-yellow-500"
                          >
                            {link.title.charAt(0).toUpperCase() + link.title.slice(1)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            } else if ("href" in navLink) {
              const { id, header, href } = navLink;

              return (
                <li
                  className="py-4 hover:underline hover:decoration-yellow-300"
                  key={id}
                  onClick={() => setIsOpen(false)}
                >
                  <Link href={href} className="hover:text-yellow-500">
                    {header}
                  </Link>
                </li>
              );
            } else {
              // Unexpected NavLink structure
              return null;
            }
          })}
        </ul>
      </nav>
    </div>
  );
}

// src/app/(customerFacing)/components/BurgerMenu.tsx

function isNavLinkSubmenu(navLink: NavLink): navLink is NavLinkSubmenu {
  return 'submenu' in navLink && Array.isArray(navLink.links);
}
