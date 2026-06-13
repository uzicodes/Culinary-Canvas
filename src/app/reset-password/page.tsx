"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ArrowRight, Home, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

// Form component that handles the search params
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      if (res.status === 429) {
        setRateLimitError('You are performing this action too fast. Please wait a moment.');
        setStatus("idle");
        return;
      }

      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update access key.");
        setStatus("error");
      }
    } catch (err) {
      setError("Vault connection error.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center space-y-4 py-10">
        <CheckCircle2 className="w-16 h-16 text-[#BCE334] mx-auto animate-bounce" />
        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Key Updated</h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
          Your new password has been set !. <br /> Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">New Security Key</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#BCE334]" />
          <input
            type="password" required placeholder="••••••••"
            className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-[#BCE334] outline-none text-sm font-bold shadow-sm transition-all"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Confirm Key</label>
        <div className="relative group">
          <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#BCE334]" />
          <input
            type="password" required placeholder="••••••••"
            className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-[#BCE334] outline-none text-sm font-bold shadow-sm transition-all"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[9px] font-black text-center uppercase tracking-widest bg-red-50 py-2 rounded-lg">
          {error}
        </p>
      )}
      {rateLimitError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">
          {rateLimitError}
        </div>
      )}

      <button type="button"
        disabled={status === "loading" || !token}
        className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
      >
        {status === "loading" ? <Loader2 className="animate-spin w-4 h-4" /> : "Finalize Reset"} <ArrowRight size={16} />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafaf9]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Reset <span className="text-[#BCE334]">Password</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Configure your new password</p>
          </div>

          <Suspense fallback={<div className="py-10 flex justify-center"><Loader2 className="animate-spin text-[#BCE334]" /></div>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 text-center border-t border-black/5 pt-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-[9px] font-black uppercase tracking-widest transition-colors">
              <Home size={10} /> Cancel Reset
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}