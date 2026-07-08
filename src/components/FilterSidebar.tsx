"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Search, X } from "lucide-react";
import { FACET_KEY, type FacetKey, type FilterGroup } from "@/types/product";
import { useFilterNav } from "@/components/FilterNavContext";

interface FilterSidebarProps {
  facets: FilterGroup[];
  /** Active values per facet key (multi-select). */
  currentFilters: Partial<Record<FacetKey, string[]>>;
  total: number;
}

function FilterSection({
  group,
  selected,
  onToggle,
  showSearch = false,
}: {
  group: FilterGroup;
  selected: string[];
  onToggle: (key: FacetKey, value: string) => void;
  showSearch?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const paramKey = FACET_KEY[group.name as keyof typeof FACET_KEY];

  const filtered = search
    ? group.options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : group.options;
  const visible = showAll ? filtered : filtered.slice(0, 7);

  // Anchor target for the header "Designers" link (#designers).
  const anchorId = paramKey === "brand" ? "designers" : undefined;

  return (
    <div id={anchorId} className="scroll-mt-[120px] border-t py-3" style={{ borderColor: "rgba(25,28,31,0.15)" }}>
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
                  checked={selected.includes(opt.label)}
                  onChange={() => paramKey && onToggle(paramKey, opt.label)}
                  className="h-4 w-4 rounded border"
                  style={{ borderColor: "rgb(229,229,229)" }}
                />
                <span className="flex-1 text-[14px]" style={{ color: "rgb(25,28,31)" }}>
                  {opt.label}
                </span>
                <span className="text-[14px]" style={{ color: "rgb(89,89,89)" }}>
                  ({opt.count.toLocaleString()})
                </span>
              </label>
            ))}
          </div>
          {filtered.length > 7 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="mt-2 text-[14px]"
              style={{ color: "rgb(0,128,0)" }}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function FilterSidebar({ facets, currentFilters, total }: FilterSidebarProps) {
  const { toggle, clearAll } = useFilterNav();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasActiveFilters = Object.values(currentFilters).some((v) => v && v.length > 0);

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

        {facets.map((group) => {
          const key = FACET_KEY[group.name as keyof typeof FACET_KEY];
          return (
            <FilterSection
              key={group.name}
              group={group}
              selected={(key && currentFilters[key]) || []}
              onToggle={toggle}
              showSearch={group.name === "Designers"}
            />
          );
        })}
      </div>
    </aside>
  );
}
