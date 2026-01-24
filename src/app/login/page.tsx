"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  let callbackUrl = "/";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("callbackUrl")) {
      callbackUrl = params.get("callbackUrl")!;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafaf9] overflow-hidden">

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#BCE334] rounded-full blur-[120px] opacity-30"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-black rounded-full blur-[120px] opacity-10"
        />
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <Image src="/gradient.png" alt="" fill className="object-cover blur-2xl opacity-40" priority />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60 overflow-hidden">
          <div className="flex flex-col items-center mb-6 text-center">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="mb-4 p-3 bg-white rounded-2xl shadow-sm border border-lime-50">
              <Image src="/without_BG_logo.png" alt="Logo" width={48} height={48} className="object-contain" />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Welcome <span className="text-[#BCE334]">Back</span>
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Login to your culinary profile</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="group space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 group-focus-within:text-black transition-colors">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input type="email" required className="w-full pl-11 pr-4 py-3 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] focus:bg-white outline-none text-sm font-bold shadow-sm transition-all text-black" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="group space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 group-focus-within:text-black transition-colors">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <input type={showPassword ? "text" : "password"} required className="w-full pl-11 pr-12 py-3 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] focus:bg-white outline-none text-sm font-bold shadow-sm transition-all text-black" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</motion.p>}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              {loading ? "Authenticating..." : "Login"} <ArrowRight size={16} />
            </motion.button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New to the canvas? <Link href="/register" className="text-black hover:text-[#BCE334] transition-colors underline underline-offset-8 decoration-2 decoration-[#BCE334]">Register Now</Link></p>
            <Link href="/forgot-password" className="inline-flex items-center justify-center w-full text-black bg-red-200 hover:bg-red-300 transition-colors text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full mb-1">Forgot Password?</Link>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[9px] font-black uppercase tracking-widest bg-black/5 px-4 py-2 rounded-full"><Home size={10} /> Back to Home</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;