"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Your bag"
        aria-modal="true"
        className="fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 md:w-[420px]"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* ── Header ── */}
        <div
          className="flex flex-shrink-0 items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "rgb(229,229,229)" }}
        >
          <div className="flex items-center gap-3">
            <h2
              className="text-[15px] font-semibold uppercase tracking-[2.5px]"
              style={{ color: "rgb(25,28,31)" }}
            >
              Your Bag
            </h2>
            {items.length > 0 && (
              <span
                className="text-[13px]"
                style={{ color: "rgba(25,28,31,0.5)" }}
              >
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close bag"
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[rgb(245,245,245)]"
          >
            <X className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
          </button>
        </div>

        {/* ── Empty state ── */}
        {items.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgb(245,245,245)" }}
            >
              <ShoppingBag
                className="h-9 w-9"
                style={{ color: "rgba(25,28,31,0.3)" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p
                className="text-[17px] font-medium"
                style={{ color: "rgb(25,28,31)" }}
              >
                Your bag is empty
              </p>
              <p
                className="text-[14px] leading-[1.6]"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                Add pieces from the catalogue to save them here.
              </p>
            </div>

            <Link
              href="/collections/all-bags"
              onClick={closeCart}
              className="mt-1 inline-flex h-[46px] items-center border px-10 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
              style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
            >
              Browse Collection
            </Link>
          </div>
        )}

        {/* ── Item list ── */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y px-6" style={{ borderColor: "rgb(229,229,229)" }}>
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <div
                        className="h-[88px] w-[88px] overflow-hidden"
                        style={{ backgroundColor: "rgb(245,245,245)" }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag
                              className="h-6 w-6"
                              style={{ color: "rgba(25,28,31,0.2)" }}
                            />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="min-w-0">
                        <p
                          className="text-[11px] font-semibold uppercase tracking-[1.8px]"
                          style={{ color: "rgb(25,28,31)" }}
                        >
                          {item.brand}
                        </p>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="mt-0.5 block truncate text-[13px] leading-snug hover:underline"
                          style={{ color: "rgb(25,28,31)" }}
                        >
                          {item.name}
                        </Link>
                        <p
                          className="mt-0.5 text-[12px]"
                          style={{ color: "rgba(25,28,31,0.5)" }}
                        >
                          {item.condition}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className="text-[15px] font-medium"
                          style={{ color: "rgb(25,28,31)" }}
                        >
                          ${item.price.toLocaleString("en-US")}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[12px] transition-colors hover:underline"
                          style={{ color: "rgba(25,28,31,0.45)" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Footer ── */}
            <div
              className="flex-shrink-0 border-t px-6 py-5"
              style={{ borderColor: "rgb(229,229,229)" }}
            >
              <div className="mb-5 flex items-baseline justify-between">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "rgba(25,28,31,0.55)" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-[20px] font-medium"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  ${subtotal.toLocaleString("en-US")}
                </span>
              </div>

              <Link
                href="/cart"
                onClick={closeCart}
                className="flex h-[47px] w-full items-center justify-center border text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
                style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
              >
                View Full Bag
              </Link>
              <button
                disabled
                className="mt-3 w-full h-[47px] cursor-not-allowed bg-[rgb(25,28,31)] text-[13px] font-semibold uppercase tracking-[1.5px] text-white opacity-50"
              >
                Proceed to Checkout
              </button>
              <p
                className="mt-2.5 text-center text-[11px]"
                style={{ color: "rgba(25,28,31,0.4)" }}
              >
                Checkout coming soon
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
