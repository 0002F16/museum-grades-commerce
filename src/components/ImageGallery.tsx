"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const imageList = images.length > 0 ? images : [""];
  const hasMultiple = imageList.length > 1;

  const goToPrev = () =>
    setActiveIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  const goToNext = () =>
    setActiveIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));

  function onKeyDown(e: React.KeyboardEvent) {
    if (!hasMultiple) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    } else if (e.key === "Escape" && zoomed) {
      setZoomed(false);
    }
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? goToPrev : goToNext)();
    touchStartX.current = null;
  }

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="group relative w-full overflow-hidden outline-none"
        style={{ backgroundColor: "rgb(245,245,245)", aspectRatio: "1 / 1" }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        {imageList[activeIndex] ? (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="block h-full w-full cursor-zoom-in"
            aria-label="Zoom image"
          >
            <img
              src={imageList[activeIndex]}
              alt={`${productName} — image ${activeIndex + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <span className="text-center text-lg font-medium" style={{ color: "rgba(25,28,31,0.4)" }}>
              {productName}
            </span>
          </div>
        )}

        {/* Zoom affordance */}
        {imageList[activeIndex] && (
          <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 opacity-0 shadow transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" style={{ color: "rgb(25,28,31)" }} />
          </span>
        )}

        {/* Prev / Next arrows — desktop */}
        {hasMultiple && (
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
        {hasMultiple && (
          <div className="absolute bottom-3 left-0 flex w-full justify-center gap-1.5 md:hidden">
            {imageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Image ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: activeIndex === i ? "20px" : "6px",
                  backgroundColor: activeIndex === i ? "rgb(255,255,255)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
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
                activeIndex === index ? "border-[rgb(25,28,31)]" : "border-transparent"
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

      {/* Lightbox */}
      {zoomed && imageList[activeIndex] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} enlarged image`}
          tabIndex={-1}
        >
          <button
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close zoom"
          >
            <X className="h-5 w-5" />
          </button>

          {hasMultiple && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <img
            src={imageList[activeIndex]}
            alt={`${productName} — enlarged image ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
