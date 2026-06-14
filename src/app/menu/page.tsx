"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m as motion } from "framer-motion"
import { ArrowRight, Utensils, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

const MenuPage = () => {

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);


  const groupedMenu = menuItems.reduce((acc, item: MenuItem) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const formatTitle = (title: string) => title.replace('-', ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-white pt-28">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-12 text-left border-l-8 border-[#BCE334] pl-6">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            <span className="text-[#BCE334] bg-black px-2">Our Digital Menu</span>
          </h1>
          <p className="text-gray-500 mt-4 text-sm font-bold uppercase tracking-widest">
            {loading ? "Syncing with kitchen..." : "Dishes On your finger tips"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-[#BCE334] w-12 h-12 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Culinary Experience...</p>
          </div>
        ) : (
          Object.keys(groupedMenu).map((category: string) => (
            <section key={category} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-200 flex-1" />
                <div className="flex items-center gap-2 bg-black text-blue-200 px-4 py-1 rounded-full text-xs font-black tracking-widest">
                  <Utensils size={12} className="text-[#BCE334]" />
                  {formatTitle(category)}
                </div>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-x-8 lg:gap-y-4">
                {/*  map function */}
                {groupedMenu[category].map((item: MenuItem, index: number) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 6) * 0.05 }}
                    whileHover={{ x: index % 2 === 0 ? 5 : -5 }}
                    className="group relative flex items-center h-20 bg-[#F1F8E9] rounded-xl overflow-hidden border border-green-100 hover:border-[#BCE334] hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="w-20 h-full relative bg-[#E8F5E9] group-hover:bg-[#BCE334]/10 transition-colors shrink-0">
                      <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 px-4 flex items-center justify-between">
                      <div className="space-y-0">
                        <h3 className="font-bold text-gray-900 text-[10px] lg:text-xs uppercase tracking-tight line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[#ED1A1A] font-black text-base lg:text-lg tracking-tighter">
                          ৳ {item.price}
                        </p>
                      </div>

                      <Link href={`/all-items?id=${item._id}`}>
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-[#BCE334]"
                        >
                          <ArrowRight size={14} />
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        )}

        <div className="mt-16 text-center bg-gray-900 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-black uppercase mb-4">Hungry for more?</h2>
          <Link href="/all-items">
            <button type="button" className="bg-[#BCE334] text-black px-10 py-3 rounded-full font-bold uppercase text-sm hover:scale-105 transition-transform">
              Explore Full Gallery
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MenuPage;