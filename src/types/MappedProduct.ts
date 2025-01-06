// types/MappedProduct.ts

export type MappedProduct = {
  id: string;
  images: string[];
  name: string;
  description: string;
  category: string; // This can be replaced with a reference if needed
  price?: number | null;
  inStock?: boolean | null;
  brand?: string | null;
};