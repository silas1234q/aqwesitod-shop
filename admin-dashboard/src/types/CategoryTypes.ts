import type { ProductDetails } from "./productTypes";

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  products:ProductDetails[]
  productCount: number;
  description?: string; // Optional description field
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  products: ProductDetails[];
  productCount: number;
  description?: string; // Optional description field
}