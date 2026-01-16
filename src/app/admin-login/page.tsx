'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ShieldCheck, Lock, Mail, ArrowLeft, X } from 'lucide-react'; 
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid admin credentials');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      
      {/* Background with Blur */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image
          src="/gradient.png"
          alt="Background"
          fill
          className="object-cover w-full h-full blur-xl opacity-60"
          priority
        />
      </div>

      <div className="flex-grow flex items-center justify-center p-4 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          {/* Decorative Ring */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#BCE334] rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-400 rounded-full blur-3xl opacity-20" />

          <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/40 overflow-hidden">
            {/* Header section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-xl">
                <ShieldCheck className="text-[#BCE334] w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Admin <span className="text-gray-500">Access</span>
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                Authorized Personnel Only
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-sm flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@culinarycanvas.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="block text-gray-700 text-[10px] font-black uppercase tracking-widest ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#BCE334] transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-black text-[#BCE334] py-4 rounded-2xl hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 font-bold uppercase text-xs tracking-[0.2em] disabled:opacity-50 mt-4"
              >
                {loading ? 'Verifying...' : 'Authenticate'}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-black text-[10px] font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Return to Profile
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLoginPage;