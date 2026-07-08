import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About Us — Museum Grades",
  description:
    "A U.S.-based boutique curating museum-quality handbags and accessories.",
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ── Statement hero ─────────────────────────────────────────── */}
        <section className="flex flex-col items-center px-6 py-20 text-center md:py-28">
          <p
            className="text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: "rgba(25,28,31,0.55)" }}
          >
            About Us
          </p>
          <h1
            className="mt-5 max-w-[720px] text-[30px] font-medium leading-[1.15] md:text-[44px]"
            style={{ color: "rgb(25,28,31)", letterSpacing: "-0.02em" }}
          >
            A U.S.-based boutique curating museum-quality handbags and
            accessories.
          </h1>
          <p
            className="mt-6 max-w-[540px] text-[16px] leading-[1.7]"
            style={{ color: "rgba(25,28,31,0.65)" }}
          >
            Every piece in our catalogue is hand-selected, authenticated, and
            graded with the same rigor a curator brings to a collection —
            because the finest bags deserve nothing less.
          </p>
        </section>

        {/* ── Pillars ────────────────────────────────────────────────── */}
        <section
          className="border-t"
          style={{ borderTopColor: "rgb(229,229,229)" }}
        >
          <div className="grid gap-10 px-4 py-14 md:grid-cols-3 md:gap-8 md:px-[42px] md:py-20">
            {[
              {
                title: "Curated",
                copy: "We seek out select pieces worth collecting — not simply reselling. Each acquisition is chosen for its condition, rarity, and enduring appeal.",
              },
              {
                title: "Authenticated",
                copy: "Every handbag and accessory is examined and authenticated before it ever reaches the catalogue, so you can buy with complete confidence.",
              },
              {
                title: "Graded",
                copy: "Our grading standard is exacting by design. When we call a piece museum quality, it has earned the name.",
              },
            ].map(({ title, copy }) => (
              <div key={title}>
                <p
                  className="text-[12px] font-semibold uppercase tracking-[2px]"
                  style={{ color: "rgb(25,28,31)" }}
                >
                  {title}
                </p>
                <p
                  className="mt-3 text-[15px] leading-[1.7]"
                  style={{ color: "rgba(25,28,31,0.65)" }}
                >
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Consign CTA band ───────────────────────────────────────── */}
        <section
          className="flex flex-col items-center gap-5 px-6 py-16 text-center md:py-20"
          style={{ backgroundColor: "rgb(25,28,31)" }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Have a piece worth collecting?
          </p>
          <h2
            className="max-w-[560px] text-[26px] font-medium leading-[1.2] md:text-[34px]"
            style={{ color: "rgb(255,255,255)", letterSpacing: "-0.02em" }}
          >
            Consign with us and let your bag attract the highest dollar.
          </h2>
          <Link
            href="/consign"
            className="mt-2 inline-flex h-[47px] items-center border px-8 text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-white hover:text-[rgb(25,28,31)]"
            style={{ borderColor: "rgba(255,255,255,0.7)" }}
          >
            Consign With Us
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
