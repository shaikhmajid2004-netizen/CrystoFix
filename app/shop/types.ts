export type CategoryId =
  | "engine"
  | "brakes"
  | "electrical"
  | "suspension"
  | "filters"
  | "lighting"
  | "batteries"
  | "accessories";

export type ProductBadge = "Bestseller" | "New Arrival" | "Limited Stock" | "Sale";

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  compatibleVehicles: string[];
  image: string;
  badge?: ProductBadge;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = "recommended" | "price-asc" | "price-desc" | "rating-desc";

export interface SortDefinition {
  value: SortOption;
  label: string;
}

export const SORT_OPTIONS: SortDefinition[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
];
