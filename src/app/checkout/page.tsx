"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      phone: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("checkoutData:v1", JSON.stringify(formData));
    router.push("/payment");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F7FBE7] px-4 pt-20 pb-10">
      <Header />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <motion.div
        className="z-10 w-full max-w-lg bg-white/80 backdrop-blur-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] border border-white p-6 md:p-8 space-y-5"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-2 bg-black rounded-xl mb-1">
            <ShieldCheck className="text-[#BCE334] w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tighter">Checkout <span className="text-[#BCE334] bg-black px-2 rounded-lg">Cart</span></h2>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Confirm your Items</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name Field (Read Only) */}
            <div className="space-y-0.5">
              <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">
                <User size={10} /> Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full bg-gray-100 border-2 border-transparent rounded-xl py-2.5 px-3 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>

            {/* Email Field (Read Only) */}
            <div className="space-y-0.5">
              <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">
                <Mail size={10} /> Identity
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 border-2 border-transparent rounded-xl py-2.5 px-3 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-0.5">
            <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">
              <MapPin size={10} /> Delivery Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Road & House no:"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full bg-black/5 border-2 border-transparent rounded-xl py-2.5 px-3 text-sm font-bold text-black outline-none focus:border-[#BCE334] transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-0.5">
            <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">
              <Phone size={10} /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+880 0000-000000"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              className="w-full bg-black/5 border-2 border-transparent rounded-xl py-2.5 px-3 text-sm font-bold text-black outline-none focus:border-[#BCE334] transition-all placeholder:text-gray-300"
            />
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight ml-1 mt-1">
              Include country code (+880)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group w-full bg-black text-[#BCE334] font-black uppercase text-xs tracking-[0.2em] py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all hover:shadow-[#BCE334]/20"
          >
            Authorize Payment <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </form>

        <div className="pt-3 border-t border-gray-100 text-center">
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
            Encryption Status: <span className="text-black">Active</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}