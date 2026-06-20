"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Better Auth redirects here with ?error=INVALID_TOKEN when the link is bad.
  if (!token || errorParam) {
    return (
      <div className="text-center">
        <p className="text-[15px] leading-relaxed" style={{ color: "rgb(25,28,31)" }}>
          This reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="mt-8 inline-block text-[13px] font-medium underline" style={{ color: "rgb(25,28,31)" }}>
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-[15px] leading-relaxed" style={{ color: "rgb(25,28,31)" }}>
          Your password has been reset. You can now sign in.
        </p>
        <Link href="/sign-in" className="mt-8 inline-block text-[13px] font-medium underline" style={{ color: "rgb(25,28,31)" }}>
          Sign in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const { error: err } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Couldn't reset password. The link may have expired.");
    } else {
      setDone(true);
      setTimeout(() => router.push("/sign-in"), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.6)" }}>
          New Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b bg-transparent pb-2 text-[15px] outline-none transition-colors focus:border-[rgb(25,28,31)]"
          style={{ borderBottomColor: "rgba(25,28,31,0.25)", color: "rgb(25,28,31)" }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: "rgba(25,28,31,0.6)" }}>
          Confirm Password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {loading ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-20" style={{ backgroundColor: "rgb(250,250,250)" }}>
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-10 block text-center text-[13px] font-semibold uppercase tracking-[4px]" style={{ color: "rgb(25,28,31)" }}>
          Museum Grades
        </Link>

        <h1 className="mb-8 text-center text-[22px] font-medium" style={{ color: "rgb(25,28,31)" }}>
          New Password
        </h1>

        <Suspense fallback={<p className="text-center text-[14px]" style={{ color: "rgba(25,28,31,0.5)" }}>Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
