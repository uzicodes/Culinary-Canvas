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

  // Get callbackUrl from query string (default to /)
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Fixed Full-page Background */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image
          src="/gradient.png"
          alt="Background"
          fill
          className="object-cover w-full h-full blur-xl opacity-60"
          priority
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Glassmorphism Card */}
        <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="mb-4 p-3 bg-white rounded-2xl shadow-sm"
            >
              <Image 
                src="/without_BG_logo.png" 
                alt="Logo" 
                width={50} 
                height={50} 
                className="object-contain" 
              />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Login
            </h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              Welcome back, Foodie!
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium text-black placeholder:text-gray-400"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium text-black placeholder:text-gray-400"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-[11px] font-bold text-center uppercase tracking-wider"
              >
                {error}
              </motion.p>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-xl hover:shadow-black/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
              {!loading && <ArrowRight size={16} />}
            </motion.button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-black hover:text-[#BCE334] transition-colors underline underline-offset-4">
                Register Now
              </Link>
            </p>
          </div>

          {/* Quick Home Link */}
          <div className="mt-6 flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-[0.15em]">
              <Home size={12} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;