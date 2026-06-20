import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCartItems } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout — Museum Grades" };

export default async function CheckoutPage() {
  // Auth guard
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in?redirect=/checkout");
  }

  // Cart guard
  const items = await getCartItems(session.user.id);
  if (items.length === 0) {
    redirect("/cart");
  }

  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  const subtotal = items.reduce((s, i) => s + i.price, 0);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[960px] px-4 py-10 md:px-[42px] md:py-16">
          <h1
            className="mb-10 text-[22px] font-semibold uppercase tracking-[2px] md:text-[26px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Checkout
          </h1>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            {/* ── Order summary ── */}
            <div className="flex-1">
              <h2
                className="mb-4 text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                Order Summary
              </h2>

              <ul
                className="divide-y border-t"
                style={{ borderColor: "rgb(229,229,229)" }}
              >
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 py-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 flex-shrink-0 object-cover"
                        style={{ backgroundColor: "rgb(245,245,245)" }}
                      />
                    ) : (
                      <div
                        className="h-16 w-16 flex-shrink-0"
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
                        className="mt-0.5 truncate text-[13px]"
                        style={{ color: "rgb(25,28,31)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="mt-0.5 text-[12px]"
                        style={{ color: "rgba(25,28,31,0.5)" }}
                      >
                        {item.condition}
                      </p>
                    </div>
                    <span
                      className="text-[15px] font-medium"
                      style={{ color: "rgb(25,28,31)" }}
                    >
                      ${item.price.toLocaleString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Total */}
              <div
                className="flex items-baseline justify-between border-t pt-4"
                style={{ borderColor: "rgb(229,229,229)" }}
              >
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
            </div>

            {/* ── Payment form ── */}
            <div className="lg:w-[380px] lg:flex-shrink-0">
              <h2
                className="mb-4 text-[11px] font-semibold uppercase tracking-[2px]"
                style={{ color: "rgba(25,28,31,0.55)" }}
              >
                Payment
              </h2>
              <CheckoutForm
                items={items}
                appId={appId}
                locationId={locationId}
                defaultName={session.user.name}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
