import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { deleteProductAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[24px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          Products{" "}
          <span className="text-[15px]" style={{ color: "rgba(25,28,31,0.45)" }}>
            ({products.length})
          </span>
        </h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-[44px] items-center bg-[rgb(25,28,31)] px-6 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-80"
        >
          + Add Product
        </Link>
      </div>

      <div className="border bg-white" style={{ borderColor: "rgb(229,229,229)" }}>
        {/* Header row */}
        <div
          className="hidden border-b px-4 py-3 text-[10px] font-semibold uppercase tracking-[1.5px] md:grid md:grid-cols-[56px_minmax(0,1fr)_110px_100px_140px] md:items-center md:gap-4"
          style={{ borderColor: "rgb(229,229,229)", color: "rgba(25,28,31,0.5)" }}
        >
          <span></span>
          <span>Product</span>
          <span>Condition</span>
          <span>Price</span>
          <span className="text-right">Actions</span>
        </div>

        {products.length === 0 && (
          <p className="px-4 py-10 text-center text-[14px]" style={{ color: "rgba(25,28,31,0.5)" }}>
            No products yet.
          </p>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-4 border-b px-4 py-3 last:border-b-0 md:grid-cols-[56px_minmax(0,1fr)_110px_100px_140px]"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden bg-[rgb(245,245,245)]">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
              ) : null}
            </div>

            <div className="min-w-0">
              <p
                className="truncate text-[11px] font-semibold uppercase tracking-[1px]"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                {p.brand}
              </p>
              <p className="truncate text-[14px]" style={{ color: "rgb(25,28,31)" }}>
                {p.name}
              </p>
              {/* mobile-only meta */}
              <p className="mt-1 text-[12px] md:hidden" style={{ color: "rgba(25,28,31,0.55)" }}>
                {p.condition} · ${p.price.toLocaleString("en-US")}
              </p>
            </div>

            <span className="hidden truncate text-[13px] md:block" style={{ color: "rgba(25,28,31,0.7)" }}>
              {p.condition}
            </span>
            <span className="hidden text-[14px] font-medium md:block" style={{ color: "rgb(25,28,31)" }}>
              ${p.price.toLocaleString("en-US")}
            </span>

            <div className="col-span-2 flex items-center justify-end gap-4 md:col-span-1">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="text-[12px] font-semibold uppercase tracking-[1px] transition-opacity hover:opacity-60"
                style={{ color: "rgb(25,28,31)" }}
              >
                Edit
              </Link>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="text-[12px] font-semibold uppercase tracking-[1px] transition-opacity hover:opacity-60"
                  style={{ color: "rgb(180,40,40)" }}
                >
                  Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
