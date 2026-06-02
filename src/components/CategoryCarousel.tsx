"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryItem } from "@/types/product";

interface CategoryCarouselProps {
  categories: CategoryItem[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  if (categories.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="group mx-[4.8px] flex flex-shrink-0 flex-col items-center"
            style={{ width: "120px" }}
          >
            <div
              className="mb-2 h-[110px] w-full overflow-hidden md:h-[150px]"
              style={{ backgroundColor: "rgb(245,245,245)" }}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm" style={{ color: "rgba(25,28,31,0.3)" }}>
                    {cat.name}
                  </span>
                </div>
              )}
            </div>
            <span
              className="text-[13px] underline"
              style={{ color: "rgb(25,28,31)" }}
            >
              {cat.name}
            </span>
            <span
              className="mt-0.5 text-[11px]"
              style={{ color: "rgba(25,28,31,0.5)" }}
            >
              {cat.count} {cat.count === 1 ? "item" : "items"}
            </span>
          </a>
        ))}
      </div>

      {categories.length > 5 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-[60px] hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity hover:opacity-80 md:flex"
            aria-label="Slide left"
          >
            <ChevronLeft className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-[60px] hidden h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-opacity hover:opacity-80 md:flex"
            aria-label="Slide right"
          >
            <ChevronRight className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
          </button>
        </>
      )}
    </div>
  );
}
