"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal branded bar (Header depends on client providers we avoid here) */}
      <div
        className="flex h-[62px] items-center border-b bg-white px-6"
        style={{ borderBottomColor: "rgb(229,229,229)" }}
      >
        <Link
          href="/"
          className="text-xl font-bold uppercase tracking-[3px]"
          style={{ color: "rgb(25,28,31)" }}
        >
          Museum Grades
        </Link>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <p
          className="text-[13px] font-semibold uppercase tracking-[3px]"
          style={{ color: "rgba(25,28,31,0.5)" }}
        >
          Something went wrong
        </p>
        <h1 className="text-[28px] font-medium md:text-[34px]" style={{ color: "rgb(25,28,31)" }}>
          We hit an unexpected error
        </h1>
        <p className="max-w-[420px] text-[15px]" style={{ color: "rgba(25,28,31,0.6)" }}>
          Please try again. If the problem persists, return home and start fresh.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex h-[47px] items-center justify-center bg-[rgb(25,28,31)] px-10 text-[12px] font-semibold uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-80"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-[47px] items-center justify-center border px-10 text-[12px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white"
            style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
          >
            Go Home
          </Link>
        </div>
      </main>
    </div>
  );
}
