"use client";

import { useState } from "react";
import { ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConditionMeter } from "@/components/ConditionMeter";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t" style={{ borderColor: "rgba(25,28,31,0.15)" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4"
      >
        <span
          className="text-[16px] font-medium"
          style={{ color: "rgb(25,28,31)" }}
        >
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
        ) : (
          <ChevronDown
            className="h-5 w-5"
            style={{ color: "rgb(25,28,31)" }}
          />
        )}
      </button>
      {isOpen && (
        <div
          className="pb-4 text-[14px] leading-[1.6]"
          style={{ color: "rgba(25,28,31,0.75)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Certified Authentic Badge */}
      <div className="flex items-center">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
          )}
          style={{
            backgroundColor: "rgb(239,235,234)",
            color: "rgb(25,28,31)",
          }}
        >
          <ShieldCheck className="h-4 w-4 text-green-600" />
          Certified Authentic
        </span>
      </div>

      {/* Brand */}
      <p
        className="text-[16px] font-semibold uppercase"
        style={{ letterSpacing: "2.4px", color: "rgb(25,28,31)" }}
      >
        {product.brand}
      </p>

      {/* Title */}
      <h1
        className="text-[28px] font-medium md:text-[42px]"
        style={{ lineHeight: "1.1", color: "rgb(25,28,31)" }}
      >
        {product.name}
      </h1>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <span
          className="text-[16px] font-normal"
          style={{ color: "rgb(25,28,31)" }}
        >
          ${product.price.toLocaleString("en-US")}
        </span>
        {product.savingsPercent > 0 && product.estRetail > 0 && (
          <span
            className="text-[16px]"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            {product.savingsPercent}% Off Est. Retail $
            {product.estRetail.toLocaleString("en-US")}
          </span>
        )}
      </div>

      {/* Add to Bag */}
      <AddToCartButton
        item={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.images[0] ?? "",
          condition: product.condition,
        }}
      />

      {/* Display-only notice */}
      <p
        className="text-center text-[12px] font-semibold uppercase"
        style={{ letterSpacing: "1.5px", color: "rgb(112,112,112)" }}
      >
        Display Only — Catalogue Reference
      </p>

      {/* Divider */}
      <div
        className="my-2 h-[1px] w-full"
        style={{ backgroundColor: "rgba(25,28,31,0.15)" }}
      />

      {/* Condition Meter */}
      <ConditionMeter condition={product.condition} />

      {/* Condition Details */}
      <div
        className="flex flex-col gap-1.5 text-[14px]"
        style={{ color: "rgba(25,28,31,0.75)" }}
      >
        <p>
          <span className="font-medium" style={{ color: "rgb(25,28,31)" }}>
            Exterior:
          </span>{" "}
          {product.exterior}
        </p>
        <p>
          <span className="font-medium" style={{ color: "rgb(25,28,31)" }}>
            Hardware:
          </span>{" "}
          {product.hardware}
        </p>
        <p>
          <span className="font-medium" style={{ color: "rgb(25,28,31)" }}>
            Interior:
          </span>{" "}
          {product.interior}
        </p>
        <p>
          <span className="font-medium" style={{ color: "rgb(25,28,31)" }}>
            Comes With:
          </span>{" "}
          {product.comesWith}
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="mt-2">
        <AccordionSection title="Description" defaultOpen>
          <p className="mb-2">
            <span className="font-medium" style={{ color: "rgb(25,28,31)" }}>
              Item #:
            </span>{" "}
            {product.itemNumber}
          </p>
          <p>{product.description}</p>
        </AccordionSection>
        <AccordionSection title="Size">
          <div className="flex flex-col gap-1">
            <p>Base Length: {product.size.base}</p>
            <p>Height: {product.size.height}</p>
            <p>Width: {product.size.depth}</p>
            <p>Drop: {product.size.drop}</p>
          </div>
        </AccordionSection>
        <AccordionSection title="Shipping + Returns">
          <p>
            Free domestic shipping on all orders. Easy returns within 30 days of
            delivery. Items must be in the same condition as when received.
          </p>
        </AccordionSection>
      </div>
    </div>
  );
}
