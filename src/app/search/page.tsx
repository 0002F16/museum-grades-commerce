import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getString(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = getString(sp.q)?.trim() ?? "";

  const { products, total } = query
    ? await getProducts({ query, pageSize: 48 })
    : { products: [], total: 0 };

  return (
    <>
      <Header />

      <main className="flex-1 px-4 py-8 md:px-[42px] md:py-10">
        {/* Header row */}
        <div className="mb-8">
          {query ? (
            <>
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
        ) : null}
      </main>

      <Footer />
    </>
  );
}
