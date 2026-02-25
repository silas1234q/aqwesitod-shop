import type { Category } from "./CategoryTypes";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductColor {
  name: string;
  hex: string;
  sortOrder: number;
}

interface ProductSize {
  size: string;
  sortOrder: number;
  productId: string;
}

interface ProductDetail {
  value: string;
  sortOrder: number;
  productId: string;
}

interface ProductCare {
  value: string;
  sortOrder: number;
  productId: string;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  size: string;
  product: ProductDetails;
  priceCents: number;
  discountedPriceCents?: number;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  discountedPriceCents?: number;
  images: ProductImage[];
  categoryId: string;
  category: Category;
  details: ProductDetail[];
  fabric: string;
  care: ProductCare[];
  sizes: ProductSize[];
  colors: ProductColor[];
  variants: ProductVariant[];
  inStock: boolean;
}
