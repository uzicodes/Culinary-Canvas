'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import menuItems from '@/data/menuItems'

const MenuPage = () => {
  return (
    <div className="min-h-screen bg-white pt-28">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Section Header */}
        <div className="mb-12 text-left border-l-8 border-[#BCE334] pl-6">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
            
            <span className="text-[#BCE334] bg-black px-2">Our Digital Menu</span>
          </h1>
          <p className="text-gray-500 mt-4 text-sm font-bold uppercase tracking-widest">
            Select your favorite &quot;finger&quot; to see details
          </p>
        </div>

        {/* The KitKat Grid: 2 Columns*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-x-8 lg:gap-y-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05 }}
              whileHover={{ x: 10 }}
              className="group relative flex items-center h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-[#BCE334] hover:bg-white transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              {/* Left Side: Small Image */}
              <div className="w-24 h-full relative bg-gray-100 group-hover:bg-[#BCE334]/10 transition-colors shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 px-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-gray-900 text-xs lg:text-sm uppercase tracking-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[#ED1A1A] font-black text-base lg:text-lg tracking-tighter">
                    ৳{item.price}
                  </p>
                </div>

                <Link href={`/all-items/${item.id}`}>
                   <motion.div 
                    whileHover={{ x: 5 }}
                    className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[#BCE334]"
                   >
                     <ArrowRight size={16} />
                   </motion.div>
                </Link>
              </div>

              {/* Bottom "KitKat" Snap Edge Decor */}
              <div className="absolute bottom-0 right-0 w-12 h-1 bg-[#BCE334] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-gray-900 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-black uppercase mb-4">Hungry for more?</h2>
          <Link href="/all-items">
            <button className="bg-[#BCE334] text-black px-10 py-3 rounded-full font-bold uppercase text-sm hover:scale-105 transition-transform">
              Explore Full Gallery
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default MenuPage