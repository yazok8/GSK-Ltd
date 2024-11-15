// types/Category.ts
import { Product } from "@prisma/client";
import { Category as PrismaCategory } from "@prisma/client";

export type Category = PrismaCategory;
// src/types/Category.ts

export type ProductWithCategory = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  inStock: boolean;
  brand: string | null;
  categoryId: string | null;
  image: string; // Ensure this is strictly a string
  category: {
    image: string | null;
    name: string;
    id: string;
    description: string | null;
  } | null;
};


export type CategoryWithImage = {
  id: string;
  name: string;
  description: string | null;
  image: string; // Ensure this is a string, handle nulls in data fetching
};