'use client'

import { motion } from 'framer-motion'
import { UserCircle, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useSession } from 'next-auth/react'

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
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

        <div className="flex-grow flex items-center justify-center p-4 pt-24 pb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white/40 text-center">
              
              {/* Illustration/Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#BCE334] blur-2xl opacity-20 rounded-full" />
                  <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                    <UserCircle className="text-[#BCE334] w-10 h-10" />
                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                Your Profile <span className="text-gray-500">Awaits</span>
              </h2>
              <p className="mt-3 text-xs text-gray-600 font-medium leading-relaxed px-4">
                Join our community of foodies to track orders, earn loyalty points, and save your favorites.
              </p>

              {/* Primary User Buttons */}
              <div className="mt-6 space-y-3">
                <Link href="/login" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#BCE334] text-black py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg shadow-[#BCE334]/20 flex items-center justify-center gap-2"
                  >
                    Login to Account
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>

                <Link href="/register" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-transparent border-2 border-black text-black py-3.5 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-colors"
                  >
                    Create New Account
                  </motion.button>
                </Link>
              </div>

              {/* Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-400">
                  <span className="bg-[#f3fce5] px-4 rounded-full">Staff Only</span>
                </div>
              </div>

              {/* ADMIN BUTTON: Green/Black before and after hover */}
              <div className="flex justify-center">
                <Link href="/admin-login">
                  <motion.button
                    // Hover: Inverts colors (Green BG, Black Text)
                    whileHover={{ scale: 1.05, backgroundColor: '#BCE334', color: '#000' }}
                    whileTap={{ scale: 0.95 }}
                    // Initial: Solid Black BG, Green Text
                    className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full shadow-lg transition-all text-[10px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: '#000', color: '#BCE334' }}
                  >
                    <ShieldCheck size={14} />
                    Admin Portal Access
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Build your Authenticated Profile Dashboard here */}
      <Footer />
    </div>
  );
}