"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createPayment } from "@/app/actions/checkout";
import type { CartItem } from "@/types/cart";
import type { ShippingAddress } from "@/types/order";

// Square Web Payments SDK types (minimal)
declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string
      ) => Promise<SquarePayments>;
    };
  }
}
interface SquarePayments {
  card: () => Promise<SquareCard>;
}
interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message: string }> }>;
  destroy: () => void;
}

interface Props {
  items: CartItem[];
  appId: string;
  locationId: string;
  defaultName?: string;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
] as const;

export function CheckoutForm({ items, appId, locationId, defaultName }: Props) {
  const router = useRouter();
  const cardRef = useRef<SquareCard | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingAddress>({
    name: defaultName ?? "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  function setField(key: keyof ShippingAddress, value: string) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  const subtotal = items.reduce((s, i) => s + i.price, 0);

  // Initialise card once SDK script has loaded
  async function initCard() {
    if (!window.Square) return;
    try {
      const payments = await window.Square.payments(appId, locationId);
      const card = await payments.card();
      await card.attach("#sq-card-container");
      cardRef.current = card;
      setCardReady(true);
    } catch (e) {
      console.error("Square card init failed:", e);
      setError("Payment form failed to load. Please refresh and try again.");
    }
  }

  useEffect(() => {
    if (sdkReady) initCard();
    return () => {
      cardRef.current?.destroy();
      cardRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkReady]);

  function validateShipping(): string | null {
    const required: [keyof ShippingAddress, string][] = [
      ["name", "Full name"],
      ["line1", "Address"],
      ["city", "City"],
      ["state", "State / Region"],
      ["postalCode", "Postal code"],
      ["country", "Country"],
    ];
    for (const [key, label] of required) {
      if (!shipping[key]?.trim()) return `${label} is required.`;
    }
    return null;
  }

  async function handlePay() {
    if (!cardRef.current) return;
    setError(null);

    const shippingError = validateShipping();
    if (shippingError) {
      setError(shippingError);
      return;
    }

    setLoading(true);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        const msg = result.errors?.[0]?.message ?? "Card validation failed.";
        setError(msg);
        return;
      }

      const outcome = await createPayment(result.token, shipping);
      if (!outcome.success) {
        setError(outcome.error);
        return;
      }

      router.push(`/orders/${outcome.orderId}`);
    } finally {
      setLoading(false);
    }
  }

  const labelCls =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[1.8px]";
  const inputCls =
    "w-full border-b bg-transparent pb-2 text-[14px] outline-none transition-colors focus:border-[rgb(25,28,31)]";
  const inputStyle = {
    borderBottomColor: "rgba(25,28,31,0.25)",
    color: "rgb(25,28,31)",
  } as const;
  const labelStyle = { color: "rgba(25,28,31,0.6)" } as const;

  return (
    <>
      {/* Square Web Payments SDK */}
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        onLoad={() => setSdkReady(true)}
        strategy="afterInteractive"
      />

      <div className="flex flex-col gap-5">
        {/* ── Shipping Address ── */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[11px] font-semibold uppercase tracking-[1.8px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Shipping Address
          </p>

          <div>
            <label className={labelCls} style={labelStyle}>
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              value={shipping.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>
              Address
            </label>
            <input
              type="text"
              autoComplete="address-line1"
              value={shipping.line1}
              onChange={(e) => setField("line1", e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>
              Apartment, suite, etc. <span className="font-normal lowercase tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              autoComplete="address-line2"
              value={shipping.line2}
              onChange={(e) => setField("line2", e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                City
              </label>
              <input
                type="text"
                autoComplete="address-level2"
                value={shipping.city}
                onChange={(e) => setField("city", e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                State / Region
              </label>
              <input
                type="text"
                autoComplete="address-level1"
                value={shipping.state}
                onChange={(e) => setField("state", e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>
                Postal Code
              </label>
              <input
                type="text"
                autoComplete="postal-code"
                value={shipping.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>
                Country
              </label>
              <select
                value={shipping.country}
                onChange={(e) => setField("country", e.target.value)}
                className={inputCls}
                style={inputStyle}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>
              Phone <span className="font-normal lowercase tracking-normal">(optional)</span>
            </label>
            <input
              type="tel"
              autoComplete="tel"
              value={shipping.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Card input container (Square mounts its iframe here) */}
        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[1.8px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Card Details
          </p>
          <div
            id="sq-card-container"
            className="min-h-[56px] rounded-sm border p-1"
            style={{ borderColor: "rgb(229,229,229)" }}
          />
          {!cardReady && !error && (
            <p className="mt-1.5 text-[12px]" style={{ color: "rgba(25,28,31,0.45)" }}>
              Loading payment form…
            </p>
          )}
        </div>

        {/* Sandbox hint */}
        <p
          className="rounded-sm border px-3 py-2.5 text-[12px] leading-[1.6]"
          style={{
            borderColor: "rgb(229,229,229)",
            color: "rgba(25,28,31,0.55)",
            backgroundColor: "rgb(250,250,250)",
          }}
        >
          <span className="font-semibold">Sandbox mode —</span> use test card{" "}
          <span className="font-mono">4111 1111 1111 1111</span>, any future date, any CVV.
        </p>

        {/* Error */}
        {error && (
          <p
            className="rounded-sm border px-3 py-2.5 text-[13px]"
            style={{ borderColor: "#fca5a5", color: "#dc2626", backgroundColor: "#fef2f2" }}
          >
            {error}
          </p>
        )}

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={!cardReady || loading}
          className="h-[50px] w-full text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: "rgb(25,28,31)" }}
        >
          {loading
            ? "Processing…"
            : `Pay $${subtotal.toLocaleString("en-US")}`}
        </button>

        <p className="text-center text-[11px]" style={{ color: "rgba(25,28,31,0.4)" }}>
          Secured by Square · All transactions encrypted
        </p>
      </div>
    </>
  );
}
