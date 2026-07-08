import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsignForm } from "@/components/ConsignForm";

export const metadata = {
  title: "Consign With Us — Museum Grades",
  description:
    "Consign your handbags with Museum Grades. We authenticate your items and attract the highest dollar, with pre-paid shipping labels the same day as your inquiry.",
};

const highlights = [
  {
    title: "Authenticated by experts",
    copy: "We accept your handbags and authenticate every piece ourselves — your item is represented accurately, and buyers bid with confidence.",
  },
  {
    title: "The highest dollar",
    copy: "Our increased attention and care leads to a higher sale. Select items get the presentation and audience they deserve.",
  },
  {
    title: "Same-day shipping labels",
    copy: "We provide pre-paid shipping labels within the same day of your inquiry, so your consignment starts moving immediately.",
  },
];

export default function ConsignPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ── Intro — email visible without scrolling ────────────────── */}
        <section className="px-4 pt-16 pb-10 text-center md:px-[42px] md:pt-24">
          <p
            className="text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: "rgba(25,28,31,0.55)" }}
          >
            Consign With Us
          </p>
          <h1
            className="mx-auto mt-5 max-w-[680px] text-[30px] font-medium leading-[1.15] md:text-[44px]"
            style={{ color: "rgb(25,28,31)", letterSpacing: "-0.02em" }}
          >
            Your bag, in the hands it deserves.
          </h1>
          <p
            className="mx-auto mt-6 max-w-[540px] text-[16px] leading-[1.7]"
            style={{ color: "rgba(25,28,31,0.65)" }}
          >
            We accept your handbags, authenticate them, and attract the highest
            dollar for your select items.
          </p>
          <p className="mt-5 text-[14px]" style={{ color: "rgba(25,28,31,0.6)" }}>
            Questions? Email{" "}
            <a
              href="mailto:info@museumgrades.com"
              className="font-medium underline"
              style={{ color: "rgb(25,28,31)" }}
            >
              info@museumgrades.com
            </a>
          </p>
        </section>

        {/* ── Highlights + form ──────────────────────────────────────── */}
        <section className="grid gap-12 px-4 pb-20 md:grid-cols-2 md:gap-16 md:px-[42px]">
          <div className="flex flex-col gap-10 md:pt-4">
            {highlights.map(({ title, copy }) => (
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

          <div className="w-full max-w-[440px] md:justify-self-center">
            <h2
              className="mb-8 text-[22px] font-medium"
              style={{ color: "rgb(25,28,31)" }}
            >
              Start Your Inquiry
            </h2>
            <ConsignForm />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
