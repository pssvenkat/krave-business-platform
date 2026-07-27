"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <main className="min-h-screen bg-[#f8faf5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Container - White field for logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white border border-[#e2efe6] rounded-2xl px-6 py-3 shadow-md mb-4">
            <Image
              src="/logo.jpg"
              alt="Krave Microgreens"
              width={140}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-[#143623]">Krave Admin</h1>
          <p className="text-[#4a6b57] text-sm mt-1">Sign in to your platform dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-xl shadow-green-900/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#143623] mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                id="login-email"
                placeholder="admin@kravemicrogreens.in"
                className="w-full px-4 py-3 bg-[#f8faf5] border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#143623] mb-1.5">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="login-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#f8faf5] border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/15 flex items-center justify-center gap-2"
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

        <p className="text-center text-[#6b8e78] text-xs mt-6">
          Krave Microgreens Admin · Authorized access only
        </p>
      </div>
    </main>
  );
}
