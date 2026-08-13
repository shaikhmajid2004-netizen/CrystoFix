"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
      }),
    });

    const data = await response.json();

    alert(data.message);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-orange-500/20 bg-zinc-950 p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-white text-center">
          CrystoFix
        </h1>

        <p className="text-center text-zinc-400 mt-2">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-white"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-black"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}