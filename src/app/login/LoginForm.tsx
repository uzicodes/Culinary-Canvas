"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ChefHat } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/dist/ReactToastify.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Admin logic check/route.ts]
    const isMasterAdmin = email === 'master_admin' && password === process.env.NEXT_PUBLIC_MASTER_ADMIN_KEY;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error('Invalid Credentials. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.success('Access Granted. Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        
        // Dynamic redirection logic based on role/route.ts]
        setTimeout(() => {
          router.push(isMasterAdmin ? '/admin/dashboard' : '/profile');
          router.refresh();
        }, 2000);
      }
    } catch (error) {
      toast.error('Vault connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">
            Access Identity
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#BCE334] transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="text"
              required
              placeholder="email@example.com or master_id"
              className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] text-gray-900 px-12 py-4 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Security Key
            </label>
            {/* --- FORGOT PASSWORD LINK --- */}
            <Link 
              href="/forgot-password" 
              className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Forgot Access?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#BCE334] transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] text-gray-900 px-12 py-4 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="w-full bg-black text-[#BCE334] py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:shadow-[#BCE334]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Enter Vault <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        {/* Register Redirect */}
        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">
          No Access Identity?{' '}
          <Link href="/register" className="text-black border-b-2 border-[#BCE334] pb-0.5 hover:text-[#BCE334] transition-colors">
            Register Now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;