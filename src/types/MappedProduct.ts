// types/MappedProduct.ts

export interface MappedCategory {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  featured?: boolean;
}

export interface MappedProduct {
  id: string;
  images: string[];
  name: string;
  description: string;

  category: MappedCategory | null;

  price?: number | null;
  inStock?: boolean | null;
  brand?: string | null;
}
