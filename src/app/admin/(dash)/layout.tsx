import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyAdmin } from "@/lib/admin-auth";
import { adminLogout } from "@/app/actions/admin";

export const metadata = { title: "Admin — Museum Grades" };

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Accounts", href: "/admin/accounts" },
  { label: "Orders", href: "/admin/orders" },
] as const;

export default async function AdminDashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await verifyAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(250,250,250)" }}>
      <header
        className="flex flex-col gap-3 border-b bg-white px-6 py-4 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: "rgb(229,229,229)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-[13px] font-semibold uppercase tracking-[3px]"
            style={{ color: "rgb(25,28,31)" }}
          >
            Museum Grades
          </Link>
          <span
            className="text-[10px] font-semibold uppercase tracking-[2px]"
            style={{ color: "rgba(25,28,31,0.4)" }}
          >
            · Admin
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-5">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[12px] font-semibold uppercase tracking-[1.5px] transition-opacity hover:opacity-60"
              style={{ color: "rgb(25,28,31)" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/"
            className="text-[12px] tracking-[1px] transition-opacity hover:opacity-60"
            style={{ color: "rgba(25,28,31,0.5)" }}
          >
            View site ↗
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-[12px] font-semibold uppercase tracking-[1.5px] transition-opacity hover:opacity-60"
              style={{ color: "rgb(180,40,40)" }}
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <main className="px-6 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
