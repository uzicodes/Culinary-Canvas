"use client";
import Image from 'next/image';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BestSelling from '@/components/BestSelling'
import About from '@/components/About'
import Blog from '@/components/Blog'
import DeliveryPartners from '@/components/DeliveryPartners'

import SpecialOffers from '@/components/SpecialOffers'
import Footer from '@/components/Footer'

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for all images & fonts to load
    const handleReady = () => setLoading(false);

    // Check if all images are loaded
    const images = Array.from(document.images);
    let loadedImages = 0;
    if (images.length === 0) handleReady();
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) handleReady();
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === images.length) handleReady();
        });
        img.addEventListener('error', () => {
          loadedImages++;
          if (loadedImages === images.length) handleReady();
        });
      }
    });

    // wait for fonts
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (images.length === 0 || loadedImages === images.length) handleReady();
      });
    }
    // Fallback max 5s
    const timeout = setTimeout(handleReady, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {loading && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black">
          {/* Main container */}
          <div className="relative">
            {/* Orbiting dots */}
            <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#BCE334] rounded-full shadow-[0_0_20px_#BCE334]" />
            </div>
            <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s', animationDelay: '-1s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#BCE334]/70 rounded-full shadow-[0_0_15px_#BCE334]" />
            </div>
            <div className="absolute inset-0 w-36 h-36 animate-spin" style={{ animationDuration: '3s', animationDelay: '-2s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#BCE334]/50 rounded-full shadow-[0_0_10px_#BCE334]" />
            </div>

            {/* Pulsing ring */}
            <div className="absolute inset-0 w-36 h-36 rounded-full border-2 border-[#BCE334]/30 animate-ping" style={{ animationDuration: '2s' }} />

            {/* Static outer ring */}
            <div className="w-36 h-36 rounded-full border border-[#BCE334]/20 flex items-center justify-center">
              {/* Inner glowing circle */}
              <div className="w-24 h-24 rounded-full bg-[#BCE334]/5 flex items-center justify-center backdrop-blur-sm border border-[#BCE334]/30"
                style={{ boxShadow: 'inset 0 0 30px rgba(188, 227, 52, 0.1)' }}>
                {/* Logo */}
                <div className="relative w-16 h-16">
                  <Image
                    src="/without_BG_logo.png"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    priority
                    sizes="64px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text with animated dots */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-[#BCE334] font-black uppercase text-xl tracking-[0.4em]">
              Culinary Canvas
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-[#BCE334] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <Header />
      <Hero />
      <Categories />
      <BestSelling />
      <SpecialOffers />
      <About />
      <DeliveryPartners />
      <Blog />
      <Footer />
    </main>
  );
}