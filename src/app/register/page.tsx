"use client";

import React, { useState } from "react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Full-page gradient background image */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <img src="/login_gradient.png" alt="Register Gradient Background" className="w-full h-full object-cover" />
      </div>
      <div className="w-full max-w-md rounded-2xl shadow-2xl py-6 px-8 relative" style={{ backgroundColor: '#F2C2CF' }}>
        <div className="flex justify-center mb-4">
          <img src="/without_BG_logo.png" alt="Culinary Canvas Logo" className="h-16 w-16 object-contain" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create your account</h2>
        <p className="text-center text-gray-500 mb-8">Join Culinary Canvas and start your healthy food journey!</p>
        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-12"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-gray-900 pr-12"
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
          <button
            type="submit"
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Register
          </button>
        </form>
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-400">Or sign up with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <div className="flex justify-center space-x-4">
          <button aria-label="Sign up with Google" className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
          </button>
          <button aria-label="Sign up with Facebook" className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </button>
          <button aria-label="Sign up with Apple" className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 20.94c1.5 0 2.75-.81 3.5-2.06 1.25-1.25.75-3.44-.94-4.13-1.69-.69-2.81.5-3.56 1.31-.81.88-1.81 2.88-1.81 2.88s-1.06-2.06-2.56-2.06c-1.5 0-2.88 1.31-2.88 3.19 0 1.88 1.38 3.19 2.88 3.19.44 0 1.06-.19 1.5-.5.5.31 1.06.5 1.81.5zM12 2.5c-1.5 0-2.81.69-3.56 1.88-1.25 1.25-.75 3.44.94 4.13 1.69.69 2.81-.5 3.56-1.31.81-.88 1.81-2.88 1.81-2.88s1.06 2.06 2.56 2.06c1.5 0 2.88-1.31 2.88-3.19C20.75 4.5 19.38 3.19 17.88 3.19c-.44 0-1.06.19-1.5.5-.5-.31-1.06-.5-1.81-.5z" />
            </svg>
          </button>
        </div>
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-sky-600 hover:underline font-semibold">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
