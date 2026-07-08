export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  estRetail: number;
  savingsPercent: number;
  condition: "New" | "Excellent" | "Shows Wear" | "Worn" | "Fair";
  color: string;
  material: string;
  bagType: string;
  images: string[];
  description: string;
  itemNumber: string;
  exterior: string;
  hardware: string;
  interior: string;
  comesWith: string;
  size: {
    base: string;
    height: string;
    depth: string;
    drop: string;
  };
}

export interface FilterOption {
  label: string;
  count: number;
}

export interface FilterGroup {
  name: string;
  options: FilterOption[];
}

export interface CategoryItem {
  name: string;
  image: string;
  href: string;
  count: number;
}

export interface PriceRange {
  min: number;
  max?: number;
}

export interface ProductFilters {
  query?: string;
  brand?: string[];
  condition?: string[];
  color?: string[];
  material?: string[];
  bagType?: string[];
  priceRanges?: PriceRange[];
  sort?: "random" | "newest" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}

/** Maps a FilterGroup name → the ProductFilters / URL key it controls. */
export const FACET_KEY = {
  Designers: "brand",
  Condition: "condition",
  "Bag Type": "bagType",
  Price: "price",
  Color: "color",
  Material: "material",
} as const;

export type FacetKey = (typeof FACET_KEY)[keyof typeof FACET_KEY];
