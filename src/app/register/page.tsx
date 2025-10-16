
"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  <div className="w-full max-w-md rounded-2xl shadow-2xl py-3 px-8 relative bg-white/60">
    <div className="flex justify-center mb-2">
      <Image
        src="/without_BG_logo.png"
        alt="Culinary Canvas Logo"
        width={64}
        height={64}
        className="h-16 w-16 object-contain"
        priority
      />
    </div>
  <h2 className="text-3xl font-bold text-center text-gray-900 mb-1">Register Now </h2>
  <p className="text-center text-gray-500 mb-4">Let us take you to the voyage of healthy food !</p>
  <form className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-12"
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-12"
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-3 px-4 font-semibold rounded-full shadow-lg transition flex items-center gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white text-lg tracking-wide"
              style={{ minWidth: '160px' }}
            >
              <span>Register</span>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-sky-600 hover:underline font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}

