"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList = images.length > 0 ? images : [""];

  const goToPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));

  const goToNext = () =>
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "rgb(245,245,245)", aspectRatio: "1 / 1" }}
      >
        {imageList[activeIndex] ? (
          <img
            src={imageList[activeIndex]}
            alt={`${productName} — image ${activeIndex + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <span
              className="text-center text-lg font-medium"
              style={{ color: "rgba(25,28,31,0.4)" }}
            >
              {productName}
            </span>
          </div>
        )}

        {/* Prev / Next arrows — visible on desktop, hidden on mobile (swipe via dots) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white shadow-md transition-opacity hover:opacity-80 md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-white shadow-md transition-opacity hover:opacity-80 md:flex"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
            </button>
          </>
        )}

        {/* Mobile dot indicators */}
        {imageList.length > 1 && (
          <div className="absolute bottom-3 left-0 flex w-full justify-center gap-1.5 md:hidden">
            {imageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Image ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: activeIndex === i ? "20px" : "6px",
                  backgroundColor:
                    activeIndex === i
                      ? "rgb(255,255,255)"
                      : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails — horizontal scroll on mobile, 4-col grid on desktop */}
      {imageList.length > 1 && (
        <div
          className="mt-2 flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "aspect-square flex-shrink-0 overflow-hidden border-2 transition-colors",
                "w-[68px] md:w-auto",
                activeIndex === index
                  ? "border-[rgb(25,28,31)]"
                  : "border-transparent"
              )}
              style={{ backgroundColor: "rgb(245,245,245)" }}
              aria-label={`View image ${index + 1}`}
            >
              {image ? (
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs" style={{ color: "rgba(25,28,31,0.3)" }}>
                    {index + 1}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
