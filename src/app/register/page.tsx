"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { m as motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Home, CheckCircle2, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setRateLimitError(null);

        if (password !== confirmPassword) {
            setError("Passwords mismatch");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password })
            });

            if (res.status === 429) {
                setRateLimitError('You are performing this action too fast. Please wait a moment.');
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                setLoading(false);
                return;
            }

            // Success - redirect to login
            router.push("/login?registered=true");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafaf9] overflow-hidden">
            <div className="fixed inset-0 -z-10 opacity-40">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#BCE334] blur-[100px] rounded-full" />
                <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src="/gradient.png" alt="" fill className="object-cover blur-xl" priority />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                {/* RESTORED: Light green background for the card */}
                <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-xl border border-white/60 relative">
                    {/* Back Arrow */}
                    <motion.button
                        onClick={() => router.back()}
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-6 left-6 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm border border-lime-100 text-gray-600 hover:text-black transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} />
                    </motion.button>

                    <div className="flex flex-col items-center mb-6 text-center">
                        <motion.div whileHover={{ scale: 1.1 }} className="mb-3 p-3 bg-white rounded-2xl shadow-sm border border-lime-50">
                            <Image src="/without_BG_logo.png" alt="Logo" width={44} height={44} />
                        </motion.div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                            Join <span className="text-[#BCE334]">Canvas</span>
                        </h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                            Welcome to Voyage of Culinary Art!
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-3">
                            {[
                                { label: "Name", icon: User, type: "text", val: name, set: setName, ph: "Full Name" },
                                { label: "Email", icon: Mail, type: "email", val: email, set: setEmail, ph: "you@email.com" },
                                { label: "Phone", icon: Phone, type: "tel", val: phone, set: setPhone, ph: "Phone Number" }
                            ].map((field) => (
                                <div key={field.label} className="relative group">
                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <input id={`register-${field.label.toLowerCase().replace(/\s+/g, '-')}`}
                                        type={field.type} required value={field.val} placeholder={field.ph}
                                        aria-label={field.label}
                                        onChange={(e) => field.set(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] focus:bg-white outline-none text-sm font-bold shadow-sm transition-all"
                                    />
                                </div>
                            ))}

                            <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black" />
                                    <input id="register-password"
                                        type={showPassword ? "text" : "password"} required value={password} placeholder="Pass"
                                        aria-label="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] focus:bg-white outline-none text-sm font-bold shadow-sm transition-all"
                                    />
                                    <button aria-label={showPassword ? "Hide password" : "Show password"} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                                <div className="relative flex-1 group">
                                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-black" />
                                    <input id="register-confirm-password"
                                        type="password" required value={confirmPassword} placeholder="Confirm"
                                        aria-label="Confirm Password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] focus:bg-white outline-none text-sm font-bold shadow-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}
                        {rateLimitError && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold text-center">
                                {rateLimitError}
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
                            className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            {loading ? "..." : "Register"} <ArrowRight size={16} />
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Member? <Link href="/login" className="text-black hover:text-[#BCE334] underline decoration-[#BCE334] decoration-2">Login</Link>
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[9px] font-black uppercase tracking-widest bg-black/5 px-4 py-2 rounded-full">
                            <Home size={10} /> Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;