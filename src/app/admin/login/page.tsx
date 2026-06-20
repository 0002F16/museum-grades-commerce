"use client";

import Link from "next/link";
import { useActionState } from "react";
import { adminLogin, type ActionState } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    adminLogin,
    undefined
  );

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-20"
      style={{ backgroundColor: "rgb(250,250,250)" }}
    >
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-10 block text-center text-[13px] font-semibold uppercase tracking-[4px]"
          style={{ color: "rgb(25,28,31)" }}
        >
          Museum Grades
        </Link>

        <h1
          className="mb-2 text-center text-[22px] font-medium"
          style={{ color: "rgb(25,28,31)" }}
        >
          Admin Access
        </h1>
        <p
          className="mb-8 text-center text-[12px] uppercase tracking-[2px]"
          style={{ color: "rgba(25,28,31,0.45)" }}
        >
          Authorised personnel only
        </p>

        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-[2px]"
              style={{ color: "rgba(25,28,31,0.6)" }}
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
              style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-[2px]"
              style={{ color: "rgba(25,28,31,0.6)" }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
              style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
            />
          </div>

          {state?.error && (
            <p className="text-[13px]" style={{ color: "rgb(180,40,40)" }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 h-[47px] border text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white disabled:opacity-50"
            style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
