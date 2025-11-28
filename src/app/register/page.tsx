"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countryCode, setCountryCode] = useState("+880");
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Popular country codes
    const countryCodes = [
        { code: "+880", country: "BD" },
        { code: "+1", country: "US/CA" },
        { code: "+44", country: "UK" },
        { code: "+91", country: "IN" },
        { code: "+86", country: "CN" },
        { code: "+81", country: "JP" },
        { code: "+49", country: "DE" },
        { code: "+33", country: "FR" },
        { code: "+61", country: "AU" },
        { code: "+971", country: "AE" },
        { code: "+966", country: "SA" },
        { code: "+92", country: "PK" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
        const fullPhone = countryCode + value;

        // Validate max length of 15 characters (country code + phone number)
        if (fullPhone.length <= 15) {
            setForm({ ...form, phone: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate phone number
        const fullPhone = countryCode + form.phone;
        if (fullPhone.length > 15) {
            setError("Phone number is too long (max 15 digits including country code)");
            return;
        }
        if (form.phone.length < 5) {
            setError("Phone number is too short");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, phone: countryCode + form.phone, password: form.password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Registration failed");
            } else {
                setSuccess("Registration successful! You can now log in.");
                setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
                setCountryCode("+880");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-start px-32">
            {/* Full-page background image */}
            <div className="fixed inset-0 w-full h-full -z-10">
                <Image
                    src="/register_bg.jpg"
                    alt="Register background"
                    fill
                    className="object-cover w-full h-full"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/40 to-[#e0e7ef]/40" />
            </div>
            <div className="w-full max-w-md rounded-2xl shadow-2xl py-2 px-6 relative bg-white/60">
                <div className="flex justify-center mb-1">
                    <Image
                        src="/without_BG_logo.png"
                        alt="Culinary Canvas Logo"
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                        priority
                    />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-0.5">Register Now </h2>
                <p className="text-center text-gray-500 text-sm mb-2">Let us take you to the voyage of healthy food !</p>
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
                            placeholder="you@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-0.5">Mobile Phone</label>
                        <div className="flex gap-1.5">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition text-gray-900 bg-white"
                                style={{ width: '100px' }}
                            >
                                {countryCodes.map((item) => (
                                    <option key={item.code} value={item.code}>
                                        {item.code} {item.country}
                                    </option>
                                ))}
                            </select>
                            <input
                                id="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handlePhoneChange}
                                autoComplete="tel"
                                required
                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
                                placeholder="1234567890"
                                maxLength={15}
                            />
                        </div>

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-0.5">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-10"
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.94 17.94 0 014.22-5.94m3.07-2.13A9.99 9.99 0 0112 5c7 0 10 7 10 7a17.94 17.94 0 01-4.22 5.94m-3.07 2.13a9.99 9.99 0 01-1.29.09c-7 0-10-7-10-7a17.94 17.94 0 014.22-5.94m3.07-2.13A9.99 9.99 0 0112 5c7 0 10 7 10 7a17.94 17.94 0 01-4.22 5.94m-3.07 2.13a9.99 9.99 0 01-1.29.09" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0s-3 7-10 7S2 12 2 12s3-7 10-7 10 7 10 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-0.5">Confirm Password</label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-10"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.94 17.94 0 014.22-5.94m3.07-2.13A9.99 9.99 0 0112 5c7 0 10 7 10 7a17.94 17.94 0 01-4.22 5.94m-3.07 2.13a9.99 9.99 0 01-1.29.09c-7 0-10-7-10-7a17.94 17.94 0 014.22-5.94m3.07-2.13A9.99 9.99 0 0112 5c7 0 10 7 10 7a17.94 17.94 0 01-4.22 5.94m-3.07 2.13a9.99 9.99 0 01-1.29.09" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0s-3 7-10 7S2 12 2 12s3-7 10-7 10 7 10 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-1">
                        <button
                            type="submit"
                            className="py-2 px-4 font-semibold rounded-full shadow-lg transition flex items-center gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-base tracking-wide"
                            style={{ minWidth: '140px' }}
                            disabled={loading}
                        >
                            <span>{loading ? "Registering..." : "Register"}</span>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </button>
                    </div>
                    {error && <p className="text-red-600 text-center text-sm mt-1">{error}</p>}
                    {success && <p className="text-green-600 text-center text-sm mt-1">{success}</p>}
                </form>
                <p className="mt-3 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-sky-600 hover:underline font-semibold">Login</Link>
                </p>
            </div>
        </div>
    );
}

