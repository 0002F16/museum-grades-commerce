import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { getProducts, getFacets } from "@/lib/products";

export const metadata = {
  title: "Museum Grades — Luxury Handbag Catalogue",
  description:
    "Discover the world's finest pre-owned luxury handbags. Curated, authenticated, and graded by Museum Grades.",
};

export default async function HomePage() {
  const { products: featured } = await getProducts({ pageSize: 8, sort: "newest" });
  const { products: moreProducts } = await getProducts({ pageSize: 12, sort: "price-desc" });
  const facets = await getFacets();
  const designerFacet = facets.find((f) => f.name === "Designers");
  const designers = designerFacet?.options.slice(0, 8) ?? [];

  // "More to explore" = products not already in featured grid
  const featuredIds = new Set(featured.map((p) => p.id));
  const moreToExplore = moreProducts.filter((p) => !featuredIds.has(p.id)).slice(0, 8);

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ── Compact Hero ────────────────────────────────────────────── */}
        <section
          className="relative flex flex-col items-center justify-center gap-5 overflow-hidden px-6 py-24 text-center"
          style={{
            minHeight: "420px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(18,18,18,0.58)" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-5">
            <p
              className="text-[11px] font-semibold uppercase tracking-[4px]"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              The Collector&apos;s Catalogue
            </p>
            <h1
              className="text-[36px] font-medium leading-[1.05] md:text-[56px]"
              style={{ color: "rgb(255,255,255)", letterSpacing: "-0.02em" }}
            >
              Museum Grades
            </h1>
            <p
              className="max-w-[480px] text-[16px] leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              The world&apos;s finest pre-owned luxury handbags — curated,
              authenticated, and catalogued.
            </p>
            <Link
              href="/collections/all-bags"
              className="mt-2 inline-flex h-[47px] items-center border px-8 text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-white hover:text-[rgb(25,28,31)]"
              style={{ borderColor: "rgba(255,255,255,0.7)" }}
            >
              View the Collection
            </Link>
          </div>
        </section>

        {/* ── Featured Acquisitions ───────────────────────────────────── */}
        <section className="px-4 py-8 md:px-[42px] md:py-12">
          <div className="mb-6 flex items-baseline justify-between md:mb-8">
            <h2
              className="text-[20px] font-medium md:text-[24px]"
              style={{ color: "rgb(25,28,31)" }}
            >
              Featured Acquisitions
            </h2>
            <Link
              href="/collections/all-bags"
              className="text-[13px] font-medium uppercase tracking-[1.5px] hover:underline"
              style={{ color: "rgba(25,28,31,0.65)" }}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── Shop by Designer ────────────────────────────────────────── */}
        {designers.length > 0 && (
          <section
            className="px-4 py-8 md:px-[42px] md:py-10"
            style={{ backgroundColor: "rgb(250,250,250)" }}
          >
            <h2
              className="mb-5 text-[16px] font-medium uppercase tracking-[2px] md:mb-6 md:text-[18px]"
              style={{ color: "rgb(25,28,31)" }}
            >
              Shop by Designer
            </h2>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {designers.map(({ label }) => (
                <Link
                  key={label}
                  href={`/collections/all-bags?brand=${encodeURIComponent(label)}`}
                  className="border px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[rgb(25,28,31)] hover:text-white md:px-5 md:text-[13px]"
                  style={{
                    borderColor: "rgb(25,28,31)",
                    color: "rgb(25,28,31)",
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/collections/all-bags"
                className="border px-4 py-2 text-[12px] font-medium transition-colors hover:bg-[rgb(25,28,31)] hover:text-white md:px-5 md:text-[13px]"
                style={{
                  borderColor: "rgba(25,28,31,0.35)",
                  color: "rgba(25,28,31,0.65)",
                }}
              >
                All Designers →
              </Link>
            </div>
          </section>
        )}

        {/* ── More to Explore (scroller) ──────────────────────────────── */}
        {moreToExplore.length > 0 && (
          <section className="px-4 py-8 md:px-[42px] md:py-12">
            <RecommendedProducts products={moreToExplore} title="More to Explore" />
          </section>
        )}

        {/* ── About / Value Props ─────────────────────────────────────── */}
        <section
          className="px-4 py-12 md:px-[42px] md:py-16"
          style={{ backgroundColor: "rgb(245,245,245)" }}
        >
          <h2
            className="mb-12 text-center text-[28px] font-medium"
            style={{ color: "rgb(25,28,31)" }}
          >
            What is Museum Grades?
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                title: "Expertly Curated",
                body: "Every piece in the catalogue is hand-selected from the world's most sought-after luxury houses — Chanel, Hermès, Louis Vuitton, and beyond.",
              },
              {
                title: "Certified Authentic",
                body: "Each bag is examined and verified for authenticity before it appears in the catalogue. No counterfeits. No compromises.",
              },
              {
                title: "Museum-Grade Condition",
                body: "We grade each item with the same rigour as a museum conservator — Excellent, Shows Wear, Worn — so you know exactly what you're viewing.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="flex flex-col gap-4">
                <div
                  className="h-[1px] w-12"
                  style={{ backgroundColor: "rgb(25,28,31)" }}
                />
                <h3
                  className="text-[16px] font-semibold uppercase tracking-[1.5px]"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[14px] leading-[1.7]"
                  style={{ color: "rgba(25,28,31,0.7)" }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Closing CTA ─────────────────────────────────────────────── */}
        <section
          className="flex flex-col items-center justify-center gap-6 px-6 py-20 text-center"
          style={{ backgroundColor: "rgb(26,28,31)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[3px]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Full Inventory
          </p>
          <h2
            className="text-[36px] font-medium"
            style={{ color: "rgb(255,255,255)", letterSpacing: "-0.01em" }}
          >
            Browse Every Bag
          </h2>
          <p
            className="max-w-[420px] text-[15px] leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Filter by designer, condition, colour, material, and price range.
            Every item catalogued. Every detail recorded.
          </p>
          <Link
            href="/collections/all-bags"
            className="mt-2 inline-flex h-[47px] items-center border px-10 text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-white hover:text-[rgb(25,28,31)]"
            style={{ borderColor: "rgba(255,255,255,0.6)" }}
          >
            View All Bags
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
