"use client";

import { motion } from "framer-motion";
import { PlusCircle, Utensils, LayoutDashboard, LogOut, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />
      
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#BCE334] blur-[120px] opacity-10" />
      </div>

      <div className="flex-grow flex items-center justify-center p-4 pt-28 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-lg"
        >
          <div className="bg-[#F7FBE7]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
            
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg mb-3">
                <LayoutDashboard className="text-[#BCE334] w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Admin <span className="text-[#BCE334]">Command</span>
              </h1>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 bg-black/5 px-4 py-1 rounded-full">
                Management Suite
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/admin/add-item">
                <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-black rounded-[2rem] flex flex-col items-center gap-3 cursor-pointer group shadow-md">
                  <PlusCircle className="text-[#BCE334] w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-[#BCE334] font-bold uppercase text-[10px] tracking-widest">ADD New Item</span>
                </motion.div>
              </Link>

              <Link href="/all-items">
                <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center gap-3 cursor-pointer shadow-sm group hover:border-[#BCE334] transition-colors">
                  <Utensils className="text-black w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-black font-bold uppercase text-[10px] tracking-widest">Manage Menu</span>
                </motion.div>
              </Link>

              {/* ANALYTICS button*/}
              <Link href="/admin/analytics" className="sm:col-span-2 mt-2">
                <motion.div 
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.98 }}
                  className="p-5 bg-[#BCE334] rounded-[2rem] flex items-center justify-between px-8 cursor-pointer shadow-lg group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-black rounded-xl">
                      <TrendingUp className="text-[#BCE334] w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="text-black font-black uppercase text-[11px] tracking-widest block">Business Analytics</span>
                      <span className="text-black/60 font-bold text-[9px] uppercase tracking-tighter">Revenue & Performance</span>
                    </div>
                  </div>
                  <ArrowRight className="text-black group-hover:translate-x-2 transition-transform" />
                </motion.div>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center px-2">
              <Link href="/profile" className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase hover:text-black transition-colors tracking-widest">
                  Back to Profile
              </Link>
              
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-[9px] font-black uppercase tracking-widest"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}