import { Suspense } from "react";
import { Header } from "@/components/Header";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts, getFacets, getCategories } from "@/lib/products";
import type { ProductFilters } from "@/types/product";

export const metadata = {
  title: "Luxury Handbags — Museum Grades",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

function parsePriceRange(val: string | undefined): { priceMin?: number; priceMax?: number } {
  if (!val) return {};
  const map: Record<string, { priceMin?: number; priceMax?: number }> = {
    "Under $500": { priceMax: 500 },
    "$500 – $1,000": { priceMin: 500, priceMax: 1000 },
    "$1,000 – $2,500": { priceMin: 1000, priceMax: 2500 },
    "$2,500 – $5,000": { priceMin: 2500, priceMax: 5000 },
    "Over $5,000": { priceMin: 5000 },
  };
  return map[val] ?? {};
}

export default async function AllBagsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const filters: ProductFilters = {
    brand: getString(sp.brand),
    condition: getString(sp.condition),
    color: getString(sp.color),
    material: getString(sp.material),
    bagType: getString(sp.bagType),
    sort: getString(sp.sort) as ProductFilters["sort"],
    page: sp.page ? Number(sp.page) : 1,
    pageSize: 24,
    ...parsePriceRange(getString(sp.price)),
  };

  const [{ products, total }, facets, categories] = await Promise.all([
    getProducts(filters),
    getFacets(),
    getCategories(),
  ]);

  const currentFilters = {
    brand: getString(sp.brand),
    condition: getString(sp.condition),
    color: getString(sp.color),
    material: getString(sp.material),
    bagType: getString(sp.bagType),
    price: getString(sp.price),
    sort: getString(sp.sort),
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Page heading */}
        <div className="px-4 md:px-[42px] pt-8 pb-2">
          <h1 className="text-[20px] font-semibold uppercase tracking-[2px] text-[rgb(25,28,31)]">
            All Bags
          </h1>
        </div>

        {/* Category carousel */}
        <div className="px-4 md:px-[42px] pb-6">
          <CategoryCarousel categories={categories} />
        </div>

        {/* Filter + Product Grid */}
        <div className="flex flex-col md:flex-row px-4 md:px-[42px] pb-12 gap-4 md:gap-8">
          <Suspense fallback={<div className="hidden md:block w-[280px] min-w-[280px]" />}>
            <FilterSidebar
              facets={facets}
              currentFilters={currentFilters}
              total={total}
            />
          </Suspense>
          <div className="flex-1 min-w-0">
            <Suspense fallback={<div className="py-24 text-center text-sm" style={{ color: "rgba(25,28,31,0.4)" }}>Loading…</div>}>
              <ProductGrid
                products={products}
                total={total}
                currentSort={getString(sp.sort) ?? "newest"}
                currentPage={sp.page ? Number(sp.page) : 1}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
