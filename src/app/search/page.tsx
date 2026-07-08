import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { getProducts } from "@/lib/products";
import type { ProductFilters } from "@/types/product";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

const POPULAR_SEARCHES = ["Chanel", "Birkin", "Tote", "Black", "Gucci"];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = getString(sp.q)?.trim() ?? "";
  const sort = (getString(sp.sort) as ProductFilters["sort"]) ?? "newest";

  const { products, total } = query
    ? await getProducts({ query, sort, pageSize: 48 })
    : { products: [], total: 0 };

  return (
    <>
      <Header />

      <main className="flex-1 px-4 py-8 md:px-[42px] md:py-10">
        {/* Header row */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          {query ? (
            <>
              <div>
                <p
                  className="text-[12px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "rgba(25,28,31,0.5)" }}
                >
                  Search results
                </p>
                <h1
                  className="mt-1 text-[32px] font-medium"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  &ldquo;{query}&rdquo;
                </h1>
                <p
                  className="mt-1 text-[14px]"
                  style={{ color: "rgba(25,28,31,0.6)" }}
                >
                  {total === 0
                    ? "No items found"
                    : `${total} item${total === 1 ? "" : "s"} found`}
                </p>
              </div>
              {total > 0 && (
                <Suspense>
                  <SortSelect currentSort={sort} />
                </Suspense>
              )}
            </>
          ) : (
            <h1
              className="text-[32px] font-medium"
              style={{ color: "rgb(25,28,31)" }}
            >
              Search
            </h1>
          )}
        </div>

        {/* Results grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <p
              className="text-[16px]"
              style={{ color: "rgba(25,28,31,0.55)" }}
            >
              No bags match &ldquo;{query}&rdquo;.
            </p>
            <Link
              href="/collections/all-bags"
              className="border px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
              style={{
                borderColor: "rgb(25,28,31)",
                color: "rgb(25,28,31)",
              }}
            >
              Browse All Bags
            </Link>
          </div>
        ) : (
          /* No query yet — suggest popular searches */
          <div className="flex flex-col items-start gap-4 py-10">
            <p className="text-[13px] font-semibold uppercase tracking-[1.5px]" style={{ color: "rgba(25,28,31,0.5)" }}>
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2.5">
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border px-4 py-2 text-[14px] transition-colors hover:bg-[rgb(245,245,245)]"
                  style={{ borderColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
                >
                  {term}
                </Link>
              ))}
            </div>
            <Link
              href="/collections/all-bags"
              className="mt-2 text-[14px] underline"
              style={{ color: "rgb(25,28,31)" }}
            >
              Or browse the full collection →
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
