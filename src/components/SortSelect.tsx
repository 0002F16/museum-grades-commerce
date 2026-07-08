"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}
