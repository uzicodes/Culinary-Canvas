"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        // Registration logic here
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
            <div className="fixed inset-0 w-full h-full -z-10">
                <Image
                    src="/gradient.png"
                    alt="Register Background"
                    fill
                    className="object-cover w-full h-full blur-md"
                    priority
                />
            </div>

            {/* Reduced max-width to sm for a tighter look */}
            <div className="w-full max-w-sm rounded-2xl shadow-2xl p-6 relative" style={{ backgroundColor: '#BBEDCF' }}>
                <div className="flex justify-center mb-2">
                    <Image 
                        src="/without_BG_logo.png" 
                        alt="Culinary Canvas Logo" 
                        width={48} 
                        height={48} 
                        className="h-12 w-12 object-contain" 
                        priority 
                    />
                </div>
                
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Create Account</h2>
                <p className="text-center text-sm text-gray-500 mb-6">Join our community of Foodies!</p>

                {/* Reduced space-y from 4 to 3 */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none transition text-sm text-gray-900"
                            placeholder="Enter Full Name Here"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none transition text-sm text-gray-900"
                            placeholder="you@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="password" university-className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none transition text-sm text-gray-900 pr-8"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.94 17.94 0 014.22-5.94m3.07-2.13A9.99 9.99 0 0112 5c7 0 10 7 10 7a17.94 17.94 0 01-4.22 5.94m-3.07 2.13a9.99 9.99 0 01-1.29.09" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0s-3 7-10 7S2 12 2 12s3-7 10-7 10 7 10 7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" university-className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Confirm</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none transition text-sm text-gray-900"
                                placeholder="Repeat"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-[11px] text-center font-bold">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-lg transition mt-2"
                    >
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-sky-600 hover:underline font-bold">Login</Link>
                </p>

                {/* --- Compact Home Icon Section --- */}
                <div className="mt-4 flex flex-col items-center border-t border-gray-300 pt-3">
                    <Link 
                        href="/" 
                        className="flex flex-col items-center text-gray-400 hover:text-sky-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;