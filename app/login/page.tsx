"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (username.trim() !== "admin" || password !== "1234") {
      setError("Username หรือ Password ไม่ถูกต้อง");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    router.push("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#929292] p-4">
      <section className="w-full max-w-[620px] rounded-2xl border border-slate-200 bg-white px-8 py-8 shadow-sm sm:px-9">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-900">
          Who are you?
        </h1>

        <form onSubmit={handleLogin}>
          <label className="mb-2 flex min-h-16 items-center gap-4 rounded-2xl border border-indigo-500 px-5 text-slate-600 shadow-[0_0_0_5px_rgba(99,102,241,0.16)] focus-within:ring-2 focus-within:ring-indigo-300">
            <svg
              aria-hidden="true"
              className="size-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <rect
                width="18"
                height="13"
                x="3"
                y="5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                rx="2"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
                d="M7 9h1m3 0h1m3 0h1M7 13h1m3 0h1m3 0h1"
              />
            </svg>
            <input
              autoComplete="username"
              autoFocus
              className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-slate-500"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
              required
              value={username}
            />
            <span className="whitespace-nowrap text-base">@company.com</span>
          </label>

          <label className="flex min-h-16 items-center gap-4 rounded-2xl border border-slate-300 px-5 text-slate-600 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
            <svg
              aria-hidden="true"
              className="size-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a15 15 0 01-2.2 2.9M6.2 6.3C3.9 7.8 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.3 3-.7"
              />
            </svg>
            <input
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-slate-500"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="1234"
              required
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p aria-live="polite" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <button
              className="rounded-2xl border border-slate-300 px-6 py-3 text-lg text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
