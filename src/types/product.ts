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

export interface ProductFilters {
  query?: string;
  brand?: string;
  condition?: string;
  color?: string;
  material?: string;
  bagType?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  pageSize?: number;
}
