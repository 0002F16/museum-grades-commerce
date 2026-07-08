"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useFilterNav } from "@/components/FilterNavContext";
import type { Product } from "@/types/product";

const SORT_OPTIONS = [
  { value: "random", label: "Random" },
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

const PAGE_SIZE = 24;

/** Page numbers to render, with -1 sentinels marking an ellipsis gap. */
function paginationRange(current: number, totalPages: number): number[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: number[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push(-1);
    out.push(p);
    prev = p;
  }
  return out;
}

export function ProductGrid({ products, total, currentSort, currentPage }: ProductGridProps) {
  const { set, isPending } = useFilterNav();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const firstItem = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <div>
      {/* Sort bar */}
      <div className="mb-6 flex items-center justify-between gap-2">
        <span className="text-[14px]" style={{ color: "rgba(25,28,31,0.7)" }}>
          {total > 0 ? `Showing ${firstItem}–${lastItem} of ${total.toLocaleString()}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[16px]" style={{ color: "rgba(25,28,31,0.75)" }}>
            Sort by
          </span>
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => set("sort", e.target.value)}
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
        </div>
      </div>

      {/* Grid — dims + ignores clicks while a navigation is in flight */}
      <div
        className={`transition-opacity duration-200 ${isPending ? "pointer-events-none opacity-50" : "opacity-100"}`}
        aria-busy={isPending}
      >
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1">
          <button
            onClick={() => set("page", String(currentPage - 1), { scroll: true, resetPage: false })}
            disabled={currentPage <= 1}
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" style={{ color: "rgb(25,28,31)" }} />
          </button>

          {paginationRange(currentPage, totalPages).map((page, i) =>
            page === -1 ? (
              <span key={`gap-${i}`} className="px-1 text-[14px]" style={{ color: "rgba(25,28,31,0.4)" }}>
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => set("page", String(page), { scroll: true, resetPage: false })}
                className="flex h-10 w-10 items-center justify-center text-[14px] transition-colors"
                style={{
                  color: currentPage === page ? "rgb(25,28,31)" : "rgba(25,28,31,0.55)",
                  fontWeight: currentPage === page ? 600 : 400,
                  borderBottom: currentPage === page ? "2px solid rgb(25,28,31)" : "none",
                }}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => set("page", String(currentPage + 1), { scroll: true, resetPage: false })}
            disabled={currentPage >= totalPages}
            className="flex h-10 w-10 items-center justify-center disabled:opacity-30"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" style={{ color: "rgb(25,28,31)" }} />
          </button>
        </div>
      )}
    </div>
  );
}
