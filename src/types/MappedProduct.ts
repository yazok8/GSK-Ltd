// types/MappedProduct.ts

import { Category } from "@prisma/client";

export type MappedProduct = {
  id: string;
  images: string[];
  name: string;
  description: string;
  category: Category | null; // This can be replaced with a reference if needed
  price?: number | null;
  inStock?: boolean | null;
  brand?: string | null;
};