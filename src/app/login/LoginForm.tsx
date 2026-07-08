"use client";

import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { m as motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle } from 'react-icons/fa';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        toast.error('Invalid Credentials. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setLoading(false);
      } else if (result?.ok) {
        toast.success('Access Granted. Redirecting...', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });

        // Small delay 
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch the updated session to check the role
        const session = await getSession();
        const userRole = (session?.user as any)?.role;

        setTimeout(() => {
          // If the role is admin, go to dashboard; otherwise, go to profile
          if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/profile');
          }
          router.refresh();
        }, 1500);
      } else {
        toast.error('Login failed. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error('Vault connection failed.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block px-2">
            Access Identity
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#BCE334] transition-colors">
              <Mail size={18} />
            </div>
            <input id="login-email"
              type="text"
              aria-label="Access Identity"
              placeholder="email@example.com (leave empty for admin)"
              className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] text-gray-900 px-12 py-4 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <label htmlFor="login-password" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Security Key
            </label>
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
            <input id="login-password"
              type="password"
              required
              aria-label="Security Key"
              placeholder="••••••••"
              className="w-full bg-black/5 border-2 border-transparent focus:border-[#BCE334] text-gray-900 px-12 py-4 rounded-2xl outline-none font-bold text-sm transition-all placeholder:text-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

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

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest">Or continue with</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
          className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
        >
          <FaGoogle className="text-red-500" size={18} /> Google
        </motion.button>

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