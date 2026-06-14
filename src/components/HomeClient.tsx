"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';


import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import BestSelling from '@/components/BestSelling'
import About from '@/components/About'
import Blog, { BlogPost } from '@/components/Blog'
import Feedback from '@/components/Feedback'
import DeliveryPartners from '@/components/DeliveryPartners'
import SpecialOffers from '@/components/SpecialOffers'
import Footer from '@/components/Footer'

export default function HomeClient({ blogPosts }: { blogPosts: BlogPost[] }) {
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const handleReady = () => setLoading(false);
        let timeoutId: NodeJS.Timeout;
        
        if (document.readyState === 'complete') {
            // If the document is already loaded, set a smooth transition delay
            timeoutId = setTimeout(handleReady, 500);
        } else {
            // If the document is still loading, wait for the load event
            window.addEventListener('load', handleReady);
        }
        
        // Strict fallback timeout to prevent indefinite freezing
        const fallbackTimeoutId = setTimeout(handleReady, 2000);
        
        return () => {
            // Clean up the load event listener
            window.removeEventListener('load', handleReady);
            // Clear all timeouts
            clearTimeout(timeoutId);
            clearTimeout(fallbackTimeoutId);
        };
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-100 to-green-200">
            {/* --- LOADING SCREEN --- */}
            {loading && (
                <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0a0a0a]">
                    {/* Gradient background animation */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#BCE334] rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '0.8s' }} />
                    </div>

                    {/* Main loader container */}
                    <div className="relative flex flex-col items-center">
                        {/* Logo container with glow */}
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Rotating border */}
                            <div className="absolute inset-0 rounded-full"
                                style={{
                                    animation: 'spin 0.6s linear infinite'
                                }}
                            />

                            {/* Inner circle with logo - slightly smaller to create border effect */}
                            <div className="absolute inset-[3px] rounded-full bg-[#0a0a0a] flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BCE334]/10 to-transparent flex items-center justify-center border border-[#BCE334]/20">
                                    <div className="relative w-14 h-14 animate-pulse" style={{ animationDuration: '0.6s' }}>
                                        <Image
                                            src="/without_BG_logo.png"
                                            alt="Loading..."
                                            fill
                                            className="object-contain drop-shadow-[0_0_15px_rgba(188,227,52,0.5)]"
                                            priority
                                            sizes="56px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Brand name */}
                        <div className="mt-8 text-center">
                            <h1 className="text-[#BCE334] font-black text-2xl tracking-[0.3em] uppercase"
                                style={{
                                    animation: 'fadeInUp 0.4s ease-out',
                                    textShadow: '0 0 30px rgba(188, 227, 52, 0.3)'
                                }}>
                                Culinary Canvas
                            </h1>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
                                Preparing your experience
                            </p>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#BCE334] to-[#9acd32] rounded-full"
                                style={{
                                    animation: 'loading 0.8s ease-in-out infinite',
                                    width: '30%'
                                }}
                            />
                        </div>
                    </div>

                    {/* CSS Animations */}
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes loading {
                            0% { transform: translateX(-100%); }
                            50% { transform: translateX(250%); }
                            100% { transform: translateX(-100%); }
                        }
                    `}</style>
                </div>
            )}

            {/* --- SITE SECTIONS --- */}
            <Header />
            <Hero isLoading={loading} />
            <Categories />
            <BestSelling />
            <SpecialOffers />
            <About />
            <DeliveryPartners />
            <Blog posts={blogPosts} />
            <Feedback />
            <Footer />
        </main>
    );
}