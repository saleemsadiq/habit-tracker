"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/auth";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // clears error after submission for new submission
    setError(null);

    // if the email and pssword fields are not filed, it returns the error and stops
    if (!email || !password) {
      setError("Please fill in al fields");
      return;
    }
    setIsLoading(true);

    // email and password values that will be checked
    const result = signup(email, password);
    if (!result.success) {
      setError(result.error ?? 'Something went wrong');
      setIsLoading(false);
      return;
    }
    router.push("/dashboard");
  };
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#F8F7FF" }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
          style={{ background: "linear-gradient(135deg, #9333EA, #2563EB)" }}
        >
          <span className="text-2xl">🔥</span>
        </div>
        <span className="text-xl font-bold" style={{ color: "#9333EA" }}>
          Habit Tracker
        </span>
      </div>
      {/* card  */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Start building better habits today.
        </p>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* email  */}
          <div className="mb-4">
            <label
              htmlFor="signup-email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              data-testid="auth-signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500
              focus:ring-2 focus:ring-purple-100"
            />
          </div>
          {/* password */}
          <div className="mb-4">
            <label
              htmlFor="signup-password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              data-testid="auth-signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2
               focus:ring-purple-100"
            />
          </div>
          {/* create account button  */}
          <button
            type="submit"
            data-testid="auth-signup-submit"
            disabled={isLoading}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #9333EA, #2563EB)" }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: "#9333EA" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
