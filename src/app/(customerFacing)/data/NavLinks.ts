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
      {title: "Import" },
      {title: "Export" },
      {title: "Distribution" }
    ]
  },
  {
    id: 'products',
    header: 'Products',
    submenu: 'products',
    links: [
      { title: "nuts & dried fruits" },
      { title: "pulses" },
      { title: "whole & ground spices" },
      { title: "cardamom" },
      { title: "herbs" },
      { title: "baking ingredients" },
      { title: "sesame" },
      { title: "bird feed" },
      { title: "pet food" }
    ]
  },
  {
    id: 'contact',
    header: 'Contact Us',
    href: '/contact',
  },
];
