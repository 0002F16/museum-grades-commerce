import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Order Confirmed — Museum Grades" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/sign-in");

  const order = await db.query.orders.findFirst({
    where: (o, { eq, and }) =>
      and(eq(o.id, id), eq(o.userId, session.user.id)),
    with: { items: true },
  });

  if (!order) notFound();

  const totalDollars = order.totalAmount / 100;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[680px] px-4 py-16 text-center md:py-24">
          {/* Icon */}
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgb(240,253,244)" }}
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1
            className="text-[26px] font-semibold md:text-[30px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Order Confirmed
          </h1>
          <p
            className="mt-2 text-[15px]"
            style={{ color: "rgba(25,28,31,0.6)" }}
          >
            Thank you for your purchase. Your order has been received.
          </p>

          {/* Order meta */}
          <div
            className="mx-auto mt-8 max-w-sm rounded-sm border p-5 text-left"
            style={{ borderColor: "rgb(229,229,229)" }}
          >
            <div className="flex items-baseline justify-between">
              <span
                className="text-[11px] font-semibold uppercase tracking-[1.8px]"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                Order
              </span>
              <span
                className="font-mono text-[12px]"
                style={{ color: "rgb(25,28,31)" }}
              >
                {order.squarePaymentId.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className="mt-6">
              <ul
                className="divide-y"
                style={{ borderColor: "rgb(229,229,229)" }}
              >
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 py-3"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 flex-shrink-0 object-cover"
                        style={{ backgroundColor: "rgb(245,245,245)" }}
                      />
                    ) : (
                      <div
                        className="h-12 w-12 flex-shrink-0"
                        style={{ backgroundColor: "rgb(245,245,245)" }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[1.5px]"
                        style={{ color: "rgb(25,28,31)" }}
                      >
                        {item.brand}
                      </p>
                      <p
                        className="truncate text-[13px]"
                        style={{ color: "rgb(25,28,31)" }}
                      >
                        {item.name}
                      </p>
                    </div>
                    <span
                      className="text-[14px] font-medium"
                      style={{ color: "rgb(25,28,31)" }}
                    >
                      ${(item.price / 100).toLocaleString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="flex items-baseline justify-between border-t pt-3"
                style={{ borderColor: "rgb(229,229,229)" }}
              >
                <span
                  className="text-[12px] font-semibold uppercase tracking-[1.5px]"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  Total
                </span>
                <span
                  className="text-[18px] font-medium"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  ${totalDollars.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {order.shippingLine1 && (
              <div
                className="mt-5 border-t pt-4"
                style={{ borderColor: "rgb(229,229,229)" }}
              >
                <p
                  className="mb-1.5 text-[11px] font-semibold uppercase tracking-[1.8px]"
                  style={{ color: "rgba(25,28,31,0.55)" }}
                >
                  Shipping To
                </p>
                <p
                  className="text-[13px] leading-[1.6]"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  {order.shippingName}
                  <br />
                  {order.shippingLine1}
                  {order.shippingLine2 ? <>, {order.shippingLine2}</> : null}
                  <br />
                  {[order.shippingCity, order.shippingState, order.shippingPostalCode]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {order.shippingCountry}
                </p>
              </div>
            )}

            {order.squareReceiptUrl && (
              <a
                href={order.squareReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-[12px] underline"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                View Square Receipt ↗
              </a>
            )}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/collections/all-bags"
              className="inline-flex h-[46px] items-center border px-8 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
              style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
