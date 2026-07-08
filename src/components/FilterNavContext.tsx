"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterNavValue {
  /** True while a filter/sort/page navigation is in flight. */
  isPending: boolean;
  /** Current URL search params (read-only snapshot). */
  params: URLSearchParams;
  /** Toggle a value within a comma-separated multi-select param. */
  toggle: (key: string, value: string) => void;
  /** Set (or clear) a single-value param. */
  set: (
    key: string,
    value: string | undefined,
    opts?: { scroll?: boolean; resetPage?: boolean }
  ) => void;
  /** Remove every filter, keeping the bare pathname. */
  clearAll: () => void;
}

const Ctx = createContext<FilterNavValue | null>(null);

export function FilterNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Holds the latest params written during an in-flight transition so that
  // rapid successive changes compose instead of racing on the stale URL.
  const pendingRef = useRef<string | null>(null);
  useEffect(() => {
    pendingRef.current = null; // URL committed — drop the optimistic copy
  }, [searchParams]);

  function currentParams() {
    return new URLSearchParams(pendingRef.current ?? searchParams.toString());
  }

  function push(params: URLSearchParams, scroll: boolean) {
    const qs = params.toString();
    pendingRef.current = qs;
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll });
    });
  }

  function toggle(key: string, value: string) {
    const params = currentParams();
    const current = params.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    params.delete("page"); // any filter change resets to page 1
    if (next.length) params.set(key, next.join(",")); else params.delete(key);
    push(params, false);
  }

  function set(
    key: string,
    value: string | undefined,
    opts?: { scroll?: boolean; resetPage?: boolean }
  ) {
    const params = currentParams();
    if (opts?.resetPage ?? true) params.delete("page");
    if (value) params.set(key, value); else params.delete(key);
    push(params, opts?.scroll ?? false);
  }

  function clearAll() {
    push(new URLSearchParams(), false);
  }

  return (
    <Ctx.Provider
      value={{ isPending, params: searchParams as URLSearchParams, toggle, set, clearAll }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFilterNav(): FilterNavValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFilterNav must be used within <FilterNavProvider>");
  return ctx;
}
