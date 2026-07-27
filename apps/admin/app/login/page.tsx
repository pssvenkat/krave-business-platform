"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#080f0b] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-900/40 border border-green-700/40 mb-4 text-3xl">
            🌱
          </div>
          <h1 className="text-2xl font-black text-white">Krave Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="login-email"
                placeholder="admin@kravemicrogreens.in"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="login-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Krave Microgreens Admin · Authorised access only
        </p>
      </div>
    </main>
  );
}
