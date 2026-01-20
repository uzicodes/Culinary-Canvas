"use client";

import { motion } from "framer-motion";
import { PlusCircle, Utensils, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#fafaf9]">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4 pt-32 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <div className="bg-[#F7FBE7]/90 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white">
            
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-xl mb-4">
                <LayoutDashboard className="text-[#BCE334] w-10 h-10" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                Admin <span className="text-[#BCE334]">Dashboard</span>
              </h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Management Command Center</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* THE POWER: Add New Item Button */}
              <Link href="/admin/add-item">
                <motion.div whileHover={{ scale: 1.03 }} className="p-8 bg-black rounded-[2.5rem] flex flex-col items-center gap-4 cursor-pointer group shadow-xl">
                  <PlusCircle className="text-[#BCE334] w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-[#BCE334] font-black uppercase text-sm tracking-widest">Add Menu Item</span>
                </motion.div>
              </Link>

              <motion.div whileHover={{ scale: 1.03 }} className="p-8 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col items-center gap-4 cursor-pointer shadow-sm group">
                <Utensils className="text-black w-10 h-10 group-hover:bounce transition-transform" />
                <span className="text-black font-black uppercase text-sm tracking-widest">Manage Menu</span>
              </motion.div>
            </div>

            <div className="mt-12 pt-8 border-t border-black/5 flex justify-center">
              <button onClick={() => signOut()} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">
                <LogOut size={14} /> End Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}