"use client";

import { X } from "lucide-react";
import { FACET_KEY } from "@/types/product";
import { useFilterNav } from "@/components/FilterNavContext";

// Param keys that represent removable filter chips (everything except sort/page).
const CHIP_KEYS = Object.values(FACET_KEY);

export function ActiveFilterChips() {
  const { params, toggle, clearAll } = useFilterNav();

  const active: { key: string; value: string }[] = [];
  for (const key of CHIP_KEYS) {
    const raw = params.get(key);
    if (!raw) continue;
    for (const value of raw.split(",").filter(Boolean)) {
      active.push({ key, value });
    }
  }

  if (active.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {active.map(({ key, value }) => (
        <button
          key={`${key}:${value}`}
          onClick={() => toggle(key, value)}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] transition-colors hover:bg-[rgb(245,245,245)]"
          style={{ borderColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
          aria-label={`Remove filter ${value}`}
        >
          {value}
          <X className="h-3.5 w-3.5" style={{ color: "rgba(25,28,31,0.6)" }} />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="ml-1 text-[13px] underline"
        style={{ color: "rgba(25,28,31,0.6)" }}
      >
        Clear all
      </button>
    </div>
  );
}
