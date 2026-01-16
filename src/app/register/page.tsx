"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Home, CheckCircle2 } from "lucide-react";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        setLoading(true);
        // Add your registration logic/API call here
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative"
            >
                {/* Glassmorphism Card */}
                <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden">
                    
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-6">
                        <motion.div 
                            whileHover={{ rotate: -10, scale: 1.1 }}
                            className="mb-4 p-3 bg-white rounded-2xl shadow-sm"
                        >
                            <Image 
                                src="/without_BG_logo.png" 
                                alt="Logo" 
                                width={48} 
                                height={48} 
                                className="object-contain" 
                            />
                        </motion.div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                            Create Account
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                            Join our community of Foodies!
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium text-black placeholder:text-gray-400"
                                    placeholder="Enter Full Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium text-black placeholder:text-gray-400"
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-9 pr-9 py-2.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-xs font-medium text-black"
                                        placeholder="Min. 8 chars"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Confirm</label>
                                <div className="relative">
                                    <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full pl-9 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-xs font-medium text-black"
                                        placeholder="Repeat"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Register Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full bg-black text-[#BCE334] py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-xl hover:shadow-black/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Register"}
                            {!loading && <ArrowRight size={16} />}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link href="/login" className="text-black hover:text-[#BCE334] transition-colors underline underline-offset-4 font-black">
                                Login
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 flex justify-center">
                        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-[0.15em]">
                            <Home size={12} />
                            Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;