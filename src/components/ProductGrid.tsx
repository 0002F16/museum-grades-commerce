"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface ProductGridProps {
  products: Product[];
  total: number;
  currentSort: string;
  currentPage: number;
}

export function ProductGrid({ products, total, currentSort, currentPage }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function setSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function setPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Newest";

  return (
    <div>
      {/* Sort bar */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <span className="text-[16px]" style={{ color: "rgba(25,28,31,0.75)" }}>
          Sort by
        </span>
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-transparent pr-6 text-[16px] font-bold cursor-pointer"
            style={{ color: "rgb(25,28,31)" }}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "rgb(25,28,31)" }}
          />
        </div>
        {/* suppress unused warning */ void sortLabel}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center" style={{ color: "rgba(25,28,31,0.5)" }}>
          No bags match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className="flex h-10 w-10 items-center justify-center text-[14px] transition-colors"
              style={{
                color: currentPage === page ? "rgb(25,28,31)" : "rgba(25,28,31,0.55)",
                fontWeight: currentPage === page ? 600 : 400,
                borderBottom: currentPage === page ? "2px solid rgb(25,28,31)" : "none",
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
