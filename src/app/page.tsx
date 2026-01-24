"use client";
import Image from 'next/image';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BestSelling from '@/components/BestSelling'
import About from '@/components/About'
import Stats from '@/components/Stats'
import Blog from '@/components/Blog'
import DeliveryPartners from '@/components/DeliveryPartners'
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
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white">
          <div className="relative w-32 h-32 mb-4 animate-pulse">
            <Image 
                src="/without_BG_logo.png" 
                alt="Loading..." 
                fill 
                className="object-contain" 
                priority
            />
          </div>
          <span className="mt-4 text-gray-700 text-lg font-bold tracking-widest" style={{ letterSpacing: '0.2em' }}>CULINARY CANVAS</span>
        </div>
      )}
      <Header />
      <Hero />
      <Categories />
      <BestSelling />
      <About />
      <Stats />
      <DeliveryPartners />
      <Blog />
      <Footer />
    </main>
  );
}