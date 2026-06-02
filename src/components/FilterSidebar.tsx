"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, Search, X } from "lucide-react";
import type { FilterGroup } from "@/types/product";

interface CurrentFilters {
  brand?: string;
  condition?: string;
  color?: string;
  material?: string;
  bagType?: string;
  price?: string;
  sort?: string;
}

interface FilterSidebarProps {
  facets: FilterGroup[];
  currentFilters: CurrentFilters;
  total: number;
}

// Map FilterGroup name → URL param key
const GROUP_KEY: Record<string, keyof CurrentFilters> = {
  Designers: "brand",
  Condition: "condition",
  "Bag Type": "bagType",
  Price: "price",
  Color: "color",
  Material: "material",
};

function FilterSection({
  group,
  currentValue,
  onSelect,
  showSearch = false,
}: {
  group: FilterGroup;
  currentValue?: string;
  onSelect: (key: keyof CurrentFilters, value: string | undefined) => void;
  showSearch?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const paramKey = GROUP_KEY[group.name];

  const filtered = search
    ? group.options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : group.options;
  const visible = showAll ? filtered : filtered.slice(0, 7);

  function handleCheck(label: string) {
    if (!paramKey) return;
    onSelect(paramKey, currentValue === label ? undefined : label);
  }

  return (
    <div className="border-t py-3" style={{ borderColor: "rgba(25,28,31,0.15)" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-[15px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          {group.name}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" style={{ color: "rgb(25,28,31)" }} />
        ) : (
          <ChevronDown className="h-4 w-4" style={{ color: "rgb(25,28,31)" }} />
        )}
      </button>

      {isOpen && (
        <div className="mt-3">
          {showSearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border py-2 pl-3 pr-8 text-[14px]"
                style={{ borderColor: "rgb(229,229,229)" }}
              />
              <Search
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: "rgb(112,112,112)" }}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            {visible.map((opt) => (
              <label key={opt.label} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentValue === opt.label}
                  onChange={() => handleCheck(opt.label)}
                  className="h-4 w-4 rounded border"
                  style={{ borderColor: "rgb(229,229,229)" }}
                />
                <span className="flex-1 text-[14px]" style={{ color: "rgb(25,28,31)" }}>
                  {opt.label}
                </span>
                <span className="text-[14px]" style={{ color: "rgb(112,112,112)" }}>
                  ({opt.count.toLocaleString()})
                </span>
              </label>
            ))}
          </div>
          {filtered.length > 7 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-2 text-[14px]"
              style={{ color: "rgb(0,128,0)" }}
            >
              Show More
            </button>
          )}
          {showAll && filtered.length > 7 && (
            <button
              onClick={() => setShowAll(false)}
              className="mt-2 text-[14px]"
              style={{ color: "rgb(0,128,0)" }}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ facets, currentFilters, total }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  function updateFilter(key: keyof CurrentFilters, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // reset to page 1 on filter change
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasActiveFilters = Object.entries(currentFilters).some(
    ([k, v]) => k !== "sort" && v
  );

  return (
    <aside className="w-full md:w-[280px] md:min-w-[280px] md:flex-shrink-0">
      {/* Mobile: tappable header that toggles filters */}
      <button
        className="flex w-full items-center justify-between pb-3 md:cursor-default"
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
      >
        <h2 className="text-[20px] font-medium md:text-[24px]" style={{ color: "rgb(25,28,31)" }}>
          Filter
        </h2>
        <span className="text-[15px]" style={{ color: "rgb(89,89,89)" }}>
          {total.toLocaleString()} Items
          <ChevronDown
            className={`ml-2 inline h-4 w-4 transition-transform md:hidden ${mobileOpen ? "rotate-180" : ""}`}
            style={{ color: "rgb(25,28,31)" }}
          />
        </span>
      </button>

      {/* Content: always visible md+, toggled on mobile */}
      <div className={`${mobileOpen ? "block" : "hidden"} md:block`}>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="mb-4 flex h-[40px] w-full items-center justify-center gap-2 border text-[14px] font-medium"
            style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </button>
        )}

        {facets.map((group) => (
          <FilterSection
            key={group.name}
            group={group}
            currentValue={currentFilters[GROUP_KEY[group.name]]}
            onSelect={updateFilter}
            showSearch={group.name === "Designers"}
          />
        ))}
      </div>
    </aside>
  );
}
