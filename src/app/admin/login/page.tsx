'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react'; 
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const AdminLoginPage = () => {
  const router = useRouter();
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
        password, 
      });

      if (result?.error) {
        setError('Invalid Security Key');
      } else {
        router.push('/admin/dashboard'); 
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafaf9] overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-10 -left-10 w-96 h-96 bg-[#BCE334] blur-[100px] opacity-30" />
        <Image src="/gradient.png" alt="" fill className="object-cover blur-3xl opacity-30" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-[#F7FBE7]/90 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-2xl border border-white/60">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-4 shadow-xl">
              <ShieldCheck className="text-[#BCE334] w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Admin <span className="text-[#BCE334]">Vault</span></h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Enter Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 border-2 border-transparent rounded-2xl focus:border-[#BCE334] outline-none text-sm font-bold shadow-sm"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

            <button disabled={loading} className="w-full bg-black text-[#BCE334] py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-black text-[9px] font-black uppercase tracking-widest bg-black/5 px-4 py-2 rounded-full">
              <ArrowLeft className="w-3 h-3" /> Return
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;