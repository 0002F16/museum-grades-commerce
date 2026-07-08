import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderTopColor: "rgb(229,229,229)", backgroundColor: "rgb(255,255,255)" }}
    >
      <div className="flex flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between md:px-[42px]">
        {/* Brand */}
        <div className="max-w-[320px]">
          <p
            className="text-xl font-bold uppercase tracking-[3px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Museum Grades
          </p>
          <p
            className="mt-3 text-[14px] leading-[1.6]"
            style={{ color: "rgba(25,28,31,0.65)" }}
          >
            A curated catalogue of the world&apos;s finest pre-owned luxury
            handbags — authenticated and graded for the discerning collector.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p
            className="text-[12px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Explore
          </p>
          <Link
            href="/collections/all-bags"
            className="text-[14px] hover:underline"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            All Bags
          </Link>
          <Link
            href="/collections/all-bags#designers"
            className="text-[14px] hover:underline"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            Designers
          </Link>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <p
            className="text-[12px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Company
          </p>
          <Link
            href="/about"
            className="text-[14px] hover:underline"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            About Us
          </Link>
          <Link
            href="/consign"
            className="text-[14px] hover:underline"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            Consign With Us
          </Link>
          <a
            href="mailto:info@museumgrades.com"
            className="text-[14px] hover:underline"
            style={{ color: "rgba(25,28,31,0.75)" }}
          >
            info@museumgrades.com
          </a>
        </div>
      </div>

      <div
        className="border-t px-4 py-5 md:px-[42px]"
        style={{ borderTopColor: "rgb(229,229,229)" }}
      >
        <p className="text-[12px]" style={{ color: "rgba(25,28,31,0.5)" }}>
          © {new Date().getFullYear()} Museum Grades. Display catalogue only —
          all designer names and marks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
