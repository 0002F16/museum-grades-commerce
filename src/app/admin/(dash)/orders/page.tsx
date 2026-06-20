import { listOrders } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

function usd(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="mb-8 text-[24px] font-medium" style={{ color: "rgb(25,28,31)" }}>
        Orders{" "}
        <span className="text-[15px]" style={{ color: "rgba(25,28,31,0.45)" }}>
          ({orders.length})
        </span>
      </h1>

      {orders.length === 0 && (
        <div className="border bg-white px-4 py-10 text-center text-[14px]" style={{ borderColor: "rgb(229,229,229)", color: "rgba(25,28,31,0.5)" }}>
          No orders yet.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border bg-white p-5"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p
                  className="font-mono text-[12px]"
                  style={{ color: "rgba(25,28,31,0.5)" }}
                >
                  #{o.id.slice(0, 16)}…
                </p>
                <p className="mt-1 text-[15px] font-medium" style={{ color: "rgb(25,28,31)" }}>
                  {o.customerName ?? "—"}
                </p>
                <p className="text-[13px]" style={{ color: "rgba(25,28,31,0.6)" }}>
                  {o.customerEmail ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-medium" style={{ color: "rgb(25,28,31)" }}>
                  {usd(o.totalAmount)}
                </p>
                <p className="text-[12px] uppercase tracking-[1px]" style={{ color: o.status === "refunded" ? "rgb(180,40,40)" : "rgb(0,128,0)" }}>
                  {o.status}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(25,28,31,0.5)" }}>
                  {fmtDate(o.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-3" style={{ borderColor: "rgb(229,229,229)" }}>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: "rgba(25,28,31,0.45)" }}>
                Ship to
              </p>
              {o.shipping ? (
                <p className="text-[13px] leading-[1.6]" style={{ color: "rgb(25,28,31)" }}>
                  {o.shipping.name}
                  <br />
                  {o.shipping.line1}
                  {o.shipping.line2 ? <>, {o.shipping.line2}</> : null}
                  <br />
                  {[o.shipping.city, o.shipping.state, o.shipping.postalCode].filter(Boolean).join(", ")}
                  <br />
                  {o.shipping.country}
                  {o.shipping.phone ? (
                    <>
                      <br />
                      <span style={{ color: "rgba(25,28,31,0.6)" }}>{o.shipping.phone}</span>
                    </>
                  ) : null}
                </p>
              ) : (
                <p className="text-[13px]" style={{ color: "rgba(25,28,31,0.4)" }}>
                  No shipping address
                </p>
              )}
            </div>

            <div className="mt-3 border-t pt-3" style={{ borderColor: "rgb(229,229,229)" }}>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[1.5px]" style={{ color: "rgba(25,28,31,0.45)" }}>
                {o.items.length} item{o.items.length === 1 ? "" : "s"}
              </p>
              <ul className="flex flex-col gap-1">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between text-[13px]">
                    <span style={{ color: "rgb(25,28,31)" }}>
                      <span style={{ color: "rgba(25,28,31,0.55)" }}>{it.brand}</span> {it.name}
                    </span>
                    <span style={{ color: "rgba(25,28,31,0.7)" }}>{usd(it.price)}</span>
                  </li>
                ))}
              </ul>
              {o.squareReceiptUrl && (
                <a
                  href={o.squareReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[1px] underline transition-opacity hover:opacity-60"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  View receipt ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
