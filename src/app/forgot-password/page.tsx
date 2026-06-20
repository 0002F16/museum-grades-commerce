"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20" style={{ backgroundColor: "rgb(250,250,250)" }}>
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-10 block text-center text-[13px] font-semibold uppercase tracking-[4px]" style={{ color: "rgb(25,28,31)" }}>
          Museum Grades
        </Link>

        <h1 className="mb-8 text-center text-[22px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          Reset Password
        </h1>

        {sent ? (
          <div className="text-center">
            <p className="text-[15px] leading-relaxed" style={{ color: "rgb(25,28,31)" }}>
              If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox.
            </p>
            <Link href="/sign-in" className="mt-8 inline-block text-[13px] font-medium underline" style={{ color: "rgb(25,28,31)" }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-8 text-center text-[14px] leading-relaxed" style={{ color: "rgba(25,28,31,0.6)" }}>
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>

            <p className="mt-8 text-center text-[13px]" style={{ color: "rgba(25,28,31,0.6)" }}>
              Remembered it?{" "}
              <Link href="/sign-in" className="font-medium underline" style={{ color: "rgb(25,28,31)" }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
