// types/Category.ts
import { Product } from "@prisma/client";
import { Category as PrismaCategory } from "@prisma/client";

export type Category = PrismaCategory;
// src/types/Category.ts

export interface ProductWithCategory extends Product {
  category: PrismaCategory | null;
}

export type CategoryWithImage = {
  id: string;
  name: string;
  description: string | null;
  image: string; // Ensure this is a string, handle nulls in data fetching
};