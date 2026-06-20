import Link from "next/link";
import { dashboardCounts } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

function usd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function AdminDashboardPage() {
  const counts = await dashboardCounts();

  const cards = [
    { label: "Products", value: counts.products.toLocaleString("en-US"), href: "/admin/products" },
    { label: "Accounts", value: counts.accounts.toLocaleString("en-US"), href: "/admin/accounts" },
    { label: "Orders", value: counts.orders.toLocaleString("en-US"), href: "/admin/orders" },
    { label: "Revenue", value: usd(counts.revenueCents), href: "/admin/orders" },
  ];

  return (
    <div>
      <h1
        className="mb-8 text-[24px] font-medium"
        style={{ color: "rgb(25,28,31)" }}
      >
        Overview
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="flex flex-col gap-3 border bg-white p-6 transition-colors hover:border-[rgb(25,28,31)]"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-[2px]"
              style={{ color: "rgba(25,28,31,0.5)" }}
            >
              {c.label}
            </span>
            <span
              className="text-[32px] font-medium leading-none"
              style={{ color: "rgb(25,28,31)" }}
            >
              {c.value}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/admin/products/new"
          className="inline-flex h-[47px] items-center bg-[rgb(25,28,31)] px-8 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-80"
        >
          + Add Product
        </Link>
      </div>
    </div>
  );
}
