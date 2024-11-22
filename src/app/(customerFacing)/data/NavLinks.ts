// src/app/(customerFacing)/data/NavLinks.ts

export interface NavLinkBase {
  id: string;
  header: string;
}

export interface NavLinkStandalone extends NavLinkBase {
  href: string;
}

export interface NavLinkSubmenu extends NavLinkBase {
  submenu: string;
  links: NavLinkLink[];
}

export interface NavLinkLink {
  id: number;
  title: string;
}

export type NavLink = NavLinkStandalone | NavLinkSubmenu;

export const NavLinks: NavLink[] = [
  {
    id: 'about',
    header: 'About',
    href: '/about',
  },
  {
    id: 'services',
    header: 'Services',
    submenu: 'services',
    links: [
      { id: 1, title: "Import" },
      { id: 2, title: "Export" },
      { id: 3, title: "Distribution" }
    ]
  },
  {
    id: 'products',
    header: 'Products',
    submenu: 'products',
    links: [
      { id: 1, title: "nuts & dried fruits" },
      { id: 2, title: "pulses" },
      { id: 3, title: "whole & ground spices" },
      { id: 4, title: "cardamom" },
      { id: 5, title: "herbs" },
      { id: 6, title: "baking ingredients" },
      { id: 7, title: "sesame" },
      { id: 8, title: "bird feed" },
      { id: 9, title: "pet food" }
    ]
  },
  {
    id: 'contact',
    header: 'Contact Us',
    href: '/contact',
  },
];
