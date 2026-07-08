"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, User, ShoppingBag, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "All Bags", href: "/collections/all-bags" },
  { label: "Designers", href: "/collections/all-bags#designers" },
  { label: "About Us", href: "/about" },
  { label: "Consign With Us", href: "/consign" },
] as const;

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const { count } = useCart();

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus the input whenever the search bar opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function openSearch() {
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    closeSearch();
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div
        className="flex h-[41px] w-full items-center justify-center px-4"
        style={{ backgroundColor: "rgb(26, 28, 31)" }}
      >
        <p className="truncate text-sm font-normal tracking-wider text-white">
          The world&apos;s finest pre-owned luxury handbags, curated with care.
        </p>
      </div>

      {/* Navigation Bar */}
      <nav
        className="relative flex h-[62px] items-center justify-between border-b bg-white px-6"
        style={{ borderBottomColor: "rgb(229, 229, 229)" }}
      >
        {/* Left cluster: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className={cn(
              "transition-transform hover:scale-110 lg:hidden",
              searchOpen && "opacity-0 pointer-events-none"
            )}
          >
            <Menu className="size-6" style={{ color: "rgb(25, 28, 31)" }} />
          </button>

          {/* Logo — hidden when search is open on mobile */}
          <Link
            href="/"
            className={cn(
              "text-xl font-bold uppercase tracking-[3px] transition-opacity",
              searchOpen && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            )}
            style={{ color: "rgb(25, 28, 31)" }}
          >
            Museum Grades
          </Link>
        </div>

        {/* Center Nav Links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "text-base font-normal transition-colors",
                  "hover:[color:rgb(25,28,31)]"
                )}
                style={{ color: "rgba(25, 28, 31, 0.75)" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: account + search */}
        <div className="flex items-center gap-4">
          {searchOpen ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, designers…"
                className="w-[200px] border-b bg-transparent pb-1 text-[14px] outline-none transition-all focus:w-[280px] md:w-[260px] md:focus:w-[360px]"
                style={{
                  borderBottomColor: "rgb(25,28,31)",
                  color: "rgb(25,28,31)",
                }}
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex-shrink-0"
              >
                <Search className="size-5" style={{ color: "rgb(25,28,31)" }} />
              </button>
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="flex-shrink-0"
              >
                <X className="size-5" style={{ color: "rgb(25,28,31)" }} />
              </button>
            </form>
          ) : (
            <>
              <Link
                href={session ? "/account" : "/sign-in"}
                aria-label={session ? "My account" : "Sign in"}
                className="transition-transform hover:scale-110"
              >
                <User className="size-5" style={{ color: "rgb(25,28,31)" }} />
              </Link>
              {/* Cart */}
              <Link href="/cart" aria-label="View bag" className="relative transition-transform hover:scale-110">
                <ShoppingBag className="size-6" style={{ color: "rgb(25, 28, 31)" }} />
                {count > 0 && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: "rgb(25,28,31)" }}
                  >
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Open search"
                onClick={openSearch}
                className="transition-transform hover:scale-110"
              >
                <Search className="size-6" style={{ color: "rgb(25, 28, 31)" }} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile slide-in menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 flex h-full w-[78%] max-w-[320px] flex-col bg-white shadow-xl">
            <div
              className="flex h-[62px] items-center justify-between border-b px-6"
              style={{ borderBottomColor: "rgb(229,229,229)" }}
            >
              <span
                className="text-base font-bold uppercase tracking-[2px]"
                style={{ color: "rgb(25,28,31)" }}
              >
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="transition-transform hover:scale-110"
              >
                <X className="size-6" style={{ color: "rgb(25,28,31)" }} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-2">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b py-4 text-[16px]"
                  style={{ borderBottomColor: "rgb(238,238,238)", color: "rgb(25,28,31)" }}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="border-b py-4 text-[16px]"
                style={{ borderBottomColor: "rgb(238,238,238)", color: "rgb(25,28,31)" }}
              >
                My Bag{count > 0 ? ` (${count})` : ""}
              </Link>
              <Link
                href={session ? "/account" : "/sign-in"}
                onClick={() => setMenuOpen(false)}
                className="py-4 text-[16px]"
                style={{ color: "rgb(25,28,31)" }}
              >
                {session ? "My Account" : "Sign In"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
