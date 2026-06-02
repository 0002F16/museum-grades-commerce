import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const img = product.images[0];

  return (
    <div className="group relative text-center">
      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="relative aspect-square w-full overflow-hidden"
          style={{ backgroundColor: "rgb(245,245,245)" }}
        >
          {img ? (
            <img
              src={img}
              alt={`${product.brand} ${product.name}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm" style={{ color: "rgba(25,28,31,0.3)" }}>
                {product.brand}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="mt-3">
        <p
          className="mb-[5px] text-[11px] font-semibold uppercase md:text-[12px]"
          style={{ letterSpacing: "1.8px", color: "rgb(25,28,31)" }}
        >
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="block text-[13px] leading-[1.35] hover:underline md:text-[14px]"
          style={{ fontWeight: 300, color: "rgb(0,0,0)" }}
        >
          {product.name}
        </Link>
        <p
          className="mt-1 text-[11px] md:text-[12px]"
          style={{ fontWeight: 300, color: "rgb(89,89,89)" }}
        >
          {product.condition}
        </p>
        <p
          className="mt-2 text-[14px] font-medium md:text-[16px]"
          style={{ color: "rgb(25,28,31)" }}
        >
          ${product.price.toLocaleString("en-US")}
        </p>
        {product.estRetail > 0 && product.savingsPercent > 0 && (
          <p
            className="mt-0.5 text-[11px] font-semibold md:text-[12px]"
            style={{ color: "rgb(0,128,0)" }}
          >
            {product.savingsPercent}% off retail
          </p>
        )}
      </div>
    </div>
  );
}
