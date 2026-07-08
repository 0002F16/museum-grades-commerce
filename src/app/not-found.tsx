import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "Not Found — Museum Grades" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
        <p
          className="text-[13px] font-semibold uppercase tracking-[3px]"
          style={{ color: "rgba(25,28,31,0.5)" }}
        >
          Error 404
        </p>
        <h1 className="text-[28px] font-medium md:text-[36px]" style={{ color: "rgb(25,28,31)" }}>
          This page could not be found
        </h1>
        <p className="max-w-[420px] text-[15px]" style={{ color: "rgba(25,28,31,0.6)" }}>
          The piece you&apos;re looking for may have been sold or moved. Explore the
          rest of the collection instead.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/collections/all-bags"
            className="inline-flex h-[47px] items-center justify-center bg-[rgb(25,28,31)] px-10 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-80"
          >
            Browse All Bags
          </Link>
          <Link
            href="/"
            className="inline-flex h-[47px] items-center justify-center border px-10 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
            style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
