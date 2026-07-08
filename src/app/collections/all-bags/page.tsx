import { Suspense } from "react";
import { Header } from "@/components/Header";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { FilterNavProvider } from "@/components/FilterNavContext";
import {
  getProducts,
  getFacets,
  getFacetCounts,
  getCategories,
  priceTierToRange,
} from "@/lib/products";
import { FACET_KEY, type FacetKey, type ProductFilters } from "@/types/product";

export const metadata = {
  title: "Luxury Handbags — Museum Grades",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Parse a comma-separated multi-select param into a string[]. */
function getList(val: string | string[] | undefined): string[] {
  const raw = Array.isArray(val) ? val[0] : val;
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

export default async function AllBagsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  // Active values per facet key.
  const selected: Record<FacetKey, string[]> = {
    brand: getList(sp.brand),
    condition: getList(sp.condition),
    color: getList(sp.color),
    material: getList(sp.material),
    bagType: getList(sp.bagType),
    price: getList(sp.price),
  };

  const filters: ProductFilters = {
    brand: selected.brand,
    condition: selected.condition,
    color: selected.color,
    material: selected.material,
    bagType: selected.bagType,
    priceRanges: selected.price
      .map(priceTierToRange)
      .filter((r): r is NonNullable<typeof r> => !!r),
    sort: (getString(sp.sort) as ProductFilters["sort"]) ?? "random",
    page: sp.page ? Number(sp.page) : 1,
    pageSize: 24,
  };

  const [{ products, total }, facets, facetCounts, categories] = await Promise.all([
    getProducts(filters),
    getFacets(),
    getFacetCounts(filters),
    getCategories(),
  ]);

  // Overlay contextual counts onto the cached facet structure.
  const facetsWithCounts = facets.map((group) => {
    const counts = facetCounts[group.name];
    return counts
      ? { ...group, options: group.options.map((o) => ({ ...o, count: counts[o.label] ?? 0 })) }
      : group;
  });

  const currentFilters: Partial<Record<FacetKey, string[]>> = {};
  for (const key of Object.values(FACET_KEY)) {
    if (selected[key].length) currentFilters[key] = selected[key];
  }

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
        <Suspense>
          <FilterNavProvider>
            <div className="flex flex-col md:flex-row px-4 md:px-[42px] pb-12 gap-4 md:gap-8">
              <FilterSidebar
                facets={facetsWithCounts}
                currentFilters={currentFilters}
                total={total}
              />
              <div className="flex-1 min-w-0">
                <ActiveFilterChips />
                <ProductGrid
                  products={products}
                  total={total}
                  currentSort={getString(sp.sort) ?? "random"}
                  currentPage={sp.page ? Number(sp.page) : 1}
                />
              </div>
            </div>
          </FilterNavProvider>
        </Suspense>
      </main>
    </>
  );
}
