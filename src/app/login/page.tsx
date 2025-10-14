"use client";

import React, { useState } from "react";

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);

		return (
			<div className="relative min-h-screen flex items-center justify-center px-4">
				{/* Full-page gradient background image */}
				<div className="fixed inset-0 w-full h-full -z-10">
					<img src="/login_gradient.png" alt="Login Gradient Background" className="w-full h-full object-cover" />
				</div>
				<div className="w-full max-w-md rounded-2xl shadow-2xl p-8 relative" style={{ backgroundColor: '#BBEDCF' }}>
				<div className="flex justify-center mb-4">
					<img src="/without_BG_logo.png" alt="Culinary Canvas Logo" className="h-16 w-16 object-contain" />
				</div>
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Login</h2>
				<p className="text-center text-gray-500 mb-8">Welcome back Foodie !</p>
				<form className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							required
							  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-yellow-500"
							placeholder="you@email.com"
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<div className="relative">
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition placeholder-gray-400 text-yellow-500 pr-12"
								placeholder="Your password"
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
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input id="remember" type="checkbox" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded" />
							<label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
						</div>
						<a href="#" className="text-sm text-sky-600 hover:underline">Forgot password?</a>
					</div>
					<button
						type="submit"
						className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition"
					>
						Login
					</button>
				</form>

				<p className="mt-8 text-center text-gray-600">
					Don't have an account?{' '}
					<a href="#" className="text-sky-600 hover:underline font-semibold">Register Now !</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
