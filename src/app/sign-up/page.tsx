"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";

// Only same-origin relative paths are honored, to avoid open-redirects.
function safeReturnTo(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/account";
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnTo(searchParams.get("returnTo"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signUp.email({ name, email, password });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Could not create account.");
    } else {
      router.push(returnTo);
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20" style={{ backgroundColor: "rgb(250,250,250)" }}>
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <Link href="/" className="mb-10 block text-center text-[13px] font-semibold uppercase tracking-[4px]" style={{ color: "rgb(25,28,31)" }}>
          Museum Grades
        </Link>

        <h1 className="mb-8 text-center text-[22px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.6)" }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
              style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.6)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
              style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.6)" }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
              style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
            />
          </div>

          {error && (
            <p className="text-[13px]" style={{ color: "rgb(180,40,40)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-[47px] border text-[13px] font-semibold uppercase tracking-[1.5px] transition-colors hover:bg-[rgb(25,28,31)] hover:text-white disabled:opacity-50"
            style={{ borderColor: "rgb(25,28,31)", color: "rgb(25,28,31)" }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px]" style={{ color: "rgba(25,28,31,0.6)" }}>
          Already have an account?{" "}
          <Link
            href={returnTo === "/account" ? "/sign-in" : `/sign-in?returnTo=${encodeURIComponent(returnTo)}`}
            className="font-medium underline"
            style={{ color: "rgb(25,28,31)" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
