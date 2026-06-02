"use client";

import Link from "next/link";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartView() {
  const { items, removeItem, clearCart } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgb(245,245,245)" }}
        >
          <ShoppingBag className="h-11 w-11" style={{ color: "rgba(25,28,31,0.3)" }} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] font-medium" style={{ color: "rgb(25,28,31)" }}>
            Your bag is empty
          </h1>
          <p
            className="max-w-[360px] text-[15px] leading-[1.6]"
            style={{ color: "rgba(25,28,31,0.55)" }}
          >
            Add pieces from the catalogue and they&apos;ll be saved here for you.
          </p>
        </div>
        <Link
          href="/collections/all-bags"
          className="mt-1 inline-flex h-[47px] items-center border px-10 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
          style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  // ── Cart with items ─────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-8 md:px-[42px] md:py-12">
      {/* Heading */}
      <div className="mb-8 flex items-baseline gap-3">
        <h1
          className="text-[24px] font-semibold uppercase tracking-[2px] md:text-[28px]"
          style={{ color: "rgb(25,28,31)" }}
        >
          Your Bag
        </h1>
        <span className="text-[15px]" style={{ color: "rgba(25,28,31,0.5)" }}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* ── Line items ── */}
        <div className="flex-1">
          <ul
            className="divide-y border-t"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6 md:gap-6">
                {/* Thumbnail */}
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div
                    className="h-[100px] w-[100px] overflow-hidden md:h-[120px] md:w-[120px]"
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
                          className="h-7 w-7"
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
                      className="text-[11px] font-semibold uppercase tracking-[1.8px] md:text-[12px]"
                      style={{ color: "rgb(25,28,31)" }}
                    >
                      {item.brand}
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-1 block text-[14px] leading-snug hover:underline md:text-[15px]"
                      style={{ color: "rgb(25,28,31)" }}
                    >
                      {item.name}
                    </Link>
                    <p
                      className="mt-1 text-[12px] md:text-[13px]"
                      style={{ color: "rgba(25,28,31,0.5)" }}
                    >
                      Condition: {item.condition}
                    </p>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <span
                      className="text-[16px] font-medium md:text-[18px]"
                      style={{ color: "rgb(25,28,31)" }}
                    >
                      ${item.price.toLocaleString("en-US")}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[12px] transition-colors hover:underline md:text-[13px]"
                      style={{ color: "rgba(25,28,31,0.45)" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/collections/all-bags"
              className="text-[13px] font-medium hover:underline"
              style={{ color: "rgb(25,28,31)" }}
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-[13px] transition-colors hover:underline"
              style={{ color: "rgba(25,28,31,0.45)" }}
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:w-[360px] lg:flex-shrink-0">
          <div
            className="border p-6 lg:sticky lg:top-[120px]"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <h2
              className="mb-5 text-[13px] font-semibold uppercase tracking-[2px]"
              style={{ color: "rgb(25,28,31)" }}
            >
              Order Summary
            </h2>

            <dl className="flex flex-col gap-3 text-[14px]">
              <div className="flex items-center justify-between">
                <dt style={{ color: "rgba(25,28,31,0.65)" }}>Subtotal</dt>
                <dd style={{ color: "rgb(25,28,31)" }}>
                  ${subtotal.toLocaleString("en-US")}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: "rgba(25,28,31,0.65)" }}>Shipping</dt>
                <dd style={{ color: "rgb(25,28,31)" }}>Free</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt style={{ color: "rgba(25,28,31,0.65)" }}>Tax</dt>
                <dd
                  className="text-[13px]"
                  style={{ color: "rgba(25,28,31,0.5)" }}
                >
                  Calculated at checkout
                </dd>
              </div>
            </dl>

            <div
              className="my-5 h-[1px] w-full"
              style={{ backgroundColor: "rgb(229,229,229)" }}
            />

            <div className="mb-5 flex items-baseline justify-between">
              <span
                className="text-[13px] font-semibold uppercase tracking-[2px]"
                style={{ color: "rgb(25,28,31)" }}
              >
                Total
              </span>
              <span
                className="text-[22px] font-medium"
                style={{ color: "rgb(25,28,31)" }}
              >
                ${subtotal.toLocaleString("en-US")}
              </span>
            </div>

            <button
              disabled
              className="h-[47px] w-full cursor-not-allowed bg-[rgb(25,28,31)] text-[13px] font-semibold uppercase tracking-[1.5px] text-white opacity-50"
            >
              Proceed to Checkout
            </button>
            <p
              className="mt-2.5 text-center text-[11px]"
              style={{ color: "rgba(25,28,31,0.4)" }}
            >
              Checkout coming soon
            </p>

            <div
              className="mt-5 flex items-center justify-center gap-2 border-t pt-5"
              style={{ borderColor: "rgb(229,229,229)" }}
            >
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-[12px]" style={{ color: "rgba(25,28,31,0.6)" }}>
                Every piece authenticated &amp; graded
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
