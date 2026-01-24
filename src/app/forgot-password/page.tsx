"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Home, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send reset link.");
        setStatus("error");
      }
    } catch (err) {
      setError("Vault connection error.");
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafaf9]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Recovery <span className="text-[#BCE334]">Portal</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Request a new access key</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Registered Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1-2 w-4 h-4 text-gray-400 group-focus-within:text-[#BCE334]" />
                <input 
                  type="email" required placeholder="chef@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-[#BCE334] outline-none text-sm font-bold shadow-sm transition-all"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

            <button 
              disabled={status === "loading"}
              className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-95"
            >
              {status === "loading" ? <Loader2 className="animate-spin w-4 h-4" /> : "Send Reset Link"} <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-black/5 pt-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-[9px] font-black uppercase tracking-widest transition-colors">
              <Home size={10} /> Return to Login
            </Link>
          </div>
        </div>
      </motion.div>

      {/* --- SUCCESS POP-UP  --- */}
      <AnimatePresence>
        {status === "sent" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#BCE334]" />
              <CheckCircle2 className="w-16 h-16 text-[#BCE334] mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Email Dispatched</h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight mt-2 leading-relaxed">
                Check your inbox! We&apos;ve sent a secure link to <br/>
                <span className="text-black font-black underline decoration-[#BCE334]">{email}</span>
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-8 w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#BCE334] hover:text-black transition-all"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}