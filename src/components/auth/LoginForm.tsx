"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  // state variable that changes on the input field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error starts at null but populated when login fails
  const [error, setError] = useState<string | null>(null);

  // prevents double submissions while the function runs
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    // clears previous error before trying again to submit
    setError(null);

    // form validation for email and password where both fields must not be empty
    if (!email || !password) {
      setError("Invalid email or password");
      return;
    }
    setIsLoading(true);

    const result = login(email, password);
    // if the login didnt work, return the error
    if (!result.success) {
      setError(result.error ?? 'Something went wrong');
      setIsLoading(false);
      return;
    }
    // if succcessful,navigate to dashbaord
    router.push("/dashboard");
  };
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#F8F7FF" }}
    >
      {/* logo */}
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

      {/* card */}
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mb-6 text-sm text-gray-600">
          Signin to continue tracking your habits
        </p>
        {/* error message that renders when error is not null  */}
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
          {/* email input  */}
          <div className="mb-4">
            <label
              htmlFor="login-email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              data-testid="auth-login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500
              focus:ring-2 focus:ring-purple-100 text-purple-600"
            />
          </div>
          {/* password input  */}
          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="mb-1 text-sm block font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="login-password"
              data-testid="auth-login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2
              focus:ring-purple-100 text-purple-600"
            />
          </div>
          {/* submit button  */}
          <button
            type="submit"
            data-testid="auth-login-submit"
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #9333EA, #2563EB)" }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium"
            style={{ color: "#9333EA" }}
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
}
