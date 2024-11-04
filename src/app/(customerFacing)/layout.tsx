"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { NavLinks } from './data/NavLinks';
import Image from 'next/image';
import GSKLogo from "../../../public/logo/GSK Logo - business card.webp";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
    <nav className="w-full top-0 h-16  text-black duration-300 ease-in p-4 z-[10] shadow-md">
    <div className='flex justify-between flex-row-reverse bg-white '>
        <Link href="/">
    <Image src={GSKLogo}
        alt='gsk logo'
        width={100}
        />
        </Link>
    <div className='flex'>
        <Button className='mb-0 mr-2'>Search</Button>
        <Input placeholder='search' />

        </div>

    </div>
    </nav>
      <div className="h-12 flex relative justify-end lg:justify-center items-center min-w-full max-w-screen-xl mx-auto bg-teal-500 mt-[25px]">
        <ul className="md:pr-10 hidden lg:flex font-bold">
          {NavLinks &&
            NavLinks.map(({ id, header, links }) => (
              <li
                key={id}
                className={`relative group ml-10 text-sm uppercase cursor-pointer duration-200 ease-out hover:scale-105 ${
                  activeId === id ? 'text-yellow-500' : ''
                } relative group`}
                onClick={() => setActiveId(id)}
              >
                <Link href={`/#${header}`}>
                  {header}
                </Link>
                
                {/* Render dropdown if links exist */}
                {links && (
                  <ul
                  className="absolute top-full left-0 mt-0 w-40 bg-white border rounded shadow-lg hidden group-hover:block"
                    role="menu"
                    aria-label={`${header} submenu`}
                  >
                    {links.map((link) => (
                      <li
                        key={link.id}
                        className="px-4 py-2 hover:bg-gray-100"
                        role="none"
                      >
                        <Link href={`/#${link.title}`}>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
      </div>
    
    </>
  );
}
