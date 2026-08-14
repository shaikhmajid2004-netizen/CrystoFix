"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (data.success) {
       window.location.href = "/dashboard";
      }
    } catch (error) {
      alert("Login failed");
    }

    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Car size={30} />
            </div>
          </div>

          <h1 className="text-4xl font-bold">CrystoFix</h1>

          <p className="text-gray-400 mt-2">
  India&apos;s Trusted Automotive Platform
</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-orange-500 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-orange-500 focus:outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 p-3 rounded-xl font-semibold shadow-lg shadow-orange-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
  Don&apos;t have an account?{" "}
  <Link
    href="/register"
    className="text-orange-500 hover:text-orange-400 font-medium"
  >
    Create Account
  </Link>
</div>
      </div>
    </main>
  );
}